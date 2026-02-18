# XLSX / Spreadsheet Processing

Use when creating, reading, editing, or manipulating spreadsheet files (.xlsx, .xlsm, .csv, .tsv). Also for cleaning messy tabular data into proper spreadsheets. The deliverable must be a spreadsheet file.

## Requirements for Outputs

### All Excel Files

- Use a consistent, professional font (e.g., Arial, Times New Roman) unless otherwise instructed
- Every Excel model MUST be delivered with ZERO formula errors (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)
- When updating templates, study and exactly match existing format, style, and conventions

### Financial Models

#### Colour Coding Standards

- **Blue text (0,0,255)**: Hardcoded inputs and scenario numbers
- **Black text (0,0,0)**: ALL formulas and calculations
- **Green text (0,128,0)**: Links pulling from other worksheets
- **Red text (255,0,0)**: External links to other files
- **Yellow background (255,255,0)**: Key assumptions needing attention

#### Number Formatting

- **Years**: Format as text strings ("2024" not "2,024")
- **Currency**: Use $#,##0 format; always specify units in headers ("Revenue ($mm)")
- **Zeros**: Use number formatting to make all zeros "-" (e.g., "$#,##0;($#,##0);-")
- **Percentages**: Default to 0.0% format (one decimal)
- **Multiples**: Format as 0.0x for valuation multiples
- **Negative numbers**: Use parentheses (123) not minus -123

#### Formula Construction

- Place ALL assumptions in separate assumption cells
- Use cell references instead of hardcoded values: `=B5*(1+$B$6)` not `=B5*1.05`
- Verify all cell references are correct
- Check for off-by-one errors in ranges
- Ensure consistent formulas across all projection periods
- Document sources for hardcodes: "Source: [System/Document], [Date], [Reference], [URL]"

## Use Formulas, Not Hardcoded Values

Always use Excel formulas instead of calculating values in Python and hardcoding them.

```python
# WRONG
total = df['Sales'].sum()
sheet['B10'] = total  # Hardcodes 5000

# CORRECT
sheet['B10'] = '=SUM(B2:B9)'
sheet['C5'] = '=(C4-C2)/C2'
sheet['D20'] = '=AVERAGE(D2:D19)'
```

## Reading and Analysing Data

```python
import pandas as pd

df = pd.read_excel('file.xlsx')
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # all sheets as dict

df.head()
df.info()
df.describe()

df.to_excel('output.xlsx', index=False)
```

## Creating New Excel Files

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active

sheet['A1'] = 'Hello'
sheet['B1'] = 'World'
sheet.append(['Row', 'of', 'data'])

sheet['B2'] = '=SUM(A1:A10)'

sheet['A1'].font = Font(bold=True, color='FF0000')
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet['A1'].alignment = Alignment(horizontal='center')
sheet.column_dimensions['A'].width = 20

wb.save('output.xlsx')
```

## Editing Existing Excel Files

```python
from openpyxl import load_workbook

wb = load_workbook('existing.xlsx')
sheet = wb.active

for sheet_name in wb.sheetnames:
    sheet = wb[sheet_name]

sheet['A1'] = 'New Value'
sheet.insert_rows(2)
sheet.delete_cols(3)

new_sheet = wb.create_sheet('NewSheet')
new_sheet['A1'] = 'Data'

wb.save('modified.xlsx')
```

## Recalculating Formulas

Excel files created by openpyxl contain formulas as strings but not calculated values. Use LibreOffice to recalculate:

```bash
libreoffice --headless --calc --convert-to xlsx output.xlsx
```

Or use a Python script with LibreOffice's macro interface to recalculate and scan for errors.

## Formula Verification Checklist

- [ ] Test 2-3 sample references before building full model
- [ ] Confirm Excel column mapping (column 64 = BL, not BK)
- [ ] Remember Excel rows are 1-indexed (DataFrame row 5 = Excel row 6)
- [ ] Handle NaN values with `pd.notna()`
- [ ] Check denominators before `/` in formulas (#DIV/0!)
- [ ] Verify all cell references point to intended cells (#REF!)
- [ ] Use correct format for cross-sheet references (Sheet1!A1)
- [ ] Test formulas on 2-3 cells before applying broadly

## Best Practices

### Library Selection
- **pandas**: Data analysis, bulk operations, simple data export
- **openpyxl**: Complex formatting, formulas, Excel-specific features

### Working with openpyxl
- Cell indices are 1-based (row=1, column=1 = A1)
- Use `data_only=True` to read calculated values
- Warning: if opened with `data_only=True` and saved, formulas are permanently lost
- For large files: `read_only=True` for reading, `write_only=True` for writing

### Working with pandas
- Specify data types: `pd.read_excel('file.xlsx', dtype={'id': str})`
- Read specific columns: `pd.read_excel('file.xlsx', usecols=['A', 'C', 'E'])`
- Handle dates: `pd.read_excel('file.xlsx', parse_dates=['date_column'])`
