package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// Configuration
const (
	MaxCyclo        = 15
	MaxLinesPerFile = 300
	BackendDir      = "backend"
)

func main() {
	fmt.Println("🚀 Starting Enhanced Quality Gate Validation...")

	// 1. Ensure we are in the right context
	rootDir, err := findRootDir()
	if err != nil {
		fmt.Printf("❌ Error finding root directory: %v\n", err)
		os.Exit(1)
	}
	if err := os.Chdir(rootDir); err != nil {
		fmt.Printf("❌ Error changing to root directory: %v\n", err)
		os.Exit(1)
	}

	// 2. Backend Quality Checks
	fmt.Println("\n📦 --- Backend Quality Gate ---")

	fmt.Println("🔍 Running go vet...")
	if err := runCommand("go", "vet", "./...", BackendDir); err != nil {
		fmt.Printf("❌ go vet failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("🔍 Running staticcheck...")
	if err := runCommand("staticcheck", "./...", BackendDir); err != nil {
		fmt.Printf("❌ staticcheck failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("🌀 Checking cyclomatic complexity (gocyclo)...")
	if err := runComplexityCheck(); err != nil {
		fmt.Printf("❌ Complexity check failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("📏 Checking file line counts...")
	if err := checkLineCounts(); err != nil {
		fmt.Printf("❌ Line count check failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("🧪 Running backend tests...")
	if err := runCommand("go", "test", "./...", BackendDir); err != nil {
		fmt.Printf("❌ Backend tests failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("\n✅ Quality Gate Passed! All checks successful.")
}

func findRootDir() (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	// Check if we are in the root (has backend)
	if isRootDir(wd) {
		return wd, nil
	}

	// Check if we are in backend
	parent := filepath.Dir(wd)
	if isRootDir(parent) {
		return parent, nil
	}

	return "", fmt.Errorf("could not find project root from %s", wd)
}

func isRootDir(path string) bool {
	_, errB := os.Stat(filepath.Join(path, BackendDir))
	return errB == nil
}

func runCommand(name string, args ...string) error {
	dir := args[len(args)-1]
	actualArgs := args[:len(args)-1]

	cmd := exec.Command(name, actualArgs...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func runComplexityCheck() error {
	// gocyclo -over 15 backend
	cmd := exec.Command("gocyclo", "-over", fmt.Sprintf("%d", MaxCyclo), BackendDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		// gocyclo exits with non-zero if it finds complex functions
		if len(output) > 0 {
			fmt.Println(string(output))
			return fmt.Errorf("complexity threshold exceeded")
		}
		return err
	}
	return nil
}

func checkLineCounts() error {
	var filesExceeding []string
	
	err := filepath.Walk(BackendDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && strings.HasSuffix(path, ".go") && !strings.Contains(path, "vendor") {
			lines, err := countLines(path)
			if err != nil {
				return err
			}
			if lines > MaxLinesPerFile {
				filesExceeding = append(filesExceeding, fmt.Sprintf("%s (%d lines)", path, lines))
			}
		}
		return nil
	})

	if err != nil {
		return err
	}

	if len(filesExceeding) > 0 {
		fmt.Println("⚠️  The following files exceed the line limit:")
		for _, f := range filesExceeding {
			fmt.Printf("   - %s\n", f)
		}
		// Fails if any file is too large
		return fmt.Errorf("file line count threshold exceeded")
	}

	fmt.Println("📊 Change stats from HEAD:")
	gitDiff := exec.Command("git", "diff", "--shortstat", "HEAD")
	diffOut, _ := gitDiff.CombinedOutput()
	if len(diffOut) > 0 {
		fmt.Printf("   %s", string(diffOut))
	} else {
		fmt.Println("   No changes since last commit.")
	}

	return nil
}

func countLines(path string) (int, error) {
	file, err := os.Open(path)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	count := 0
	for scanner.Scan() {
		count++
	}
	return count, scanner.Err()
}
