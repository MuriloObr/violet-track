package parsers

import "errors"

var (
	ErrInvalidFilename = errors.New("invalid filename format")
	ErrMalformedCSV    = errors.New("malformed CSV structure")
	ErrInvalidDate     = errors.New("invalid date format in CSV")
	ErrInvalidAmount   = errors.New("invalid numeric value in CSV")
	ErrEmptyFile       = errors.New("the file is empty")
	ErrUnsupported     = errors.New("unsupported file format")
)
