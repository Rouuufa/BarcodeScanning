import pytest
from unittest.mock import patch
import main as barcode_scanner

def test_valid_barcode():
    barcode_data = "123456789012"
    
    # Mock the scan function's return value
    with patch('main.scan', return_value="Expected Result") as mock_scan:
        result = barcode_scanner.scan(barcode_data)
        assert result == "Expected Result"
        mock_scan.assert_called_once_with(barcode_data)  # Ensure scan was called with barcode_data

def test_invalid_barcode():
    barcode_data = "invalid_barcode"
    
    # Mock the scan function to raise a ValueError
    with pytest.raises(ValueError), patch('main.scan', side_effect=ValueError):
        barcode_scanner.scan(barcode_data)

def test_process_scanned_data():
    barcode_data = "123456789012"
    
    # Mock the process_data function's return value
    with patch('main.process_data', return_value="Expected Processed Data") as mock_process_data:
        result = barcode_scanner.process_data(barcode_data)
        assert result == "Expected Processed Data"
        mock_process_data.assert_called_once_with(barcode_data)  # Ensure process_data was called with barcode_data
