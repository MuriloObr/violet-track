package main

import (
	"fmt"
	"os"
	"os/exec"
)

func main() {
	fmt.Println("🚀 Starting Quality Gate Validation...")

	// 1. Run Backend Tests
	fmt.Println("🧪 Running backend tests...")
	cmdTest := exec.Command("go", "test", "./...")
	cmdTest.Dir = "backend"
	if err := runCommand(cmdTest); err != nil {
		fmt.Printf("❌ Backend tests failed: %v\n", err)
		os.Exit(1)
	}

	// 2. Run Backend Build
	fmt.Println("🏗️  Building backend...")
	cmdBuild := exec.Command("go", "build", "-o", "/dev/null", "./cmd/api/main.go")
	cmdBuild.Dir = "backend"
	if err := runCommand(cmdBuild); err != nil {
		fmt.Printf("❌ Backend build failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✅ Quality Gate Passed!")
}

func runCommand(cmd *exec.Cmd) error {
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
