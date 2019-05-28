import { Column, GridOption } from '../../models';
import { sumTotalsDollarColoredBoldFormatter } from '../sumTotalsDollarColoredBoldFormatter';

describe('sumTotalsDollarColoredBoldFormatter', () => {
  // stub some methods of the SlickGrid Grid instance
  const gridStub = {
    getOptions: jest.fn()
  };

  it('should display an empty string when no value is provided', () => {
    const output = sumTotalsDollarColoredBoldFormatter({}, {} as Column);
    expect(output).toBe('');
  });

  it('should display an empty string when the "sum" does not find the field property in its object', () => {
    const columnDef = { id: 'column3', field: 'column3' } as Column;
    const totals = { sum: { column1: 123, column2: 345 } };
    const output = sumTotalsDollarColoredBoldFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display an empty string when the sum property is null', () => {
    const columnDef = { id: 'column1', field: 'column1' } as Column;
    const totals = { sum: { column1: null } };
    const output = sumTotalsDollarColoredBoldFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display an empty string when the average input is not a number', () => {
    const columnDef = { id: 'column1', field: 'column1' } as Column;
    const totals = { sum: { column1: 'abc' } };
    const output = sumTotalsDollarColoredBoldFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display a negative sum with at least 2 decimals in red when its input is negative', () => {
    const totals = { sum: { column1: -123, column2: -34.5678, column3: -2.4 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1' } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2 } } as Column, {});

    expect(output1).toBe('<span style="color:red; font-weight: bold;">-$123.00</span>');
    expect(output2).toBe('<span style="color:red; font-weight: bold;">-$34.57</span>');
  });

  it('should display a negative sum in red with at least 2 decimals in parentheses instead of the negative sign when its input is negative', () => {
    const totals = { sum: { column1: -123, column2: -34.5678, column3: -2.4 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1', params: { displayNegativeNumberWithParentheses: true } } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2, displayNegativeNumberWithParentheses: true } } as Column, {});

    expect(output1).toBe('<span style="color:red; font-weight: bold;">($123.00)</span>');
    expect(output2).toBe('<span style="color:red; font-weight: bold;">($34.57)</span>');
  });

  it('should display a negative sum with parentheses when input is negative and "displayNegativeNumberWithParentheses" is enabled in the Grid Options', () => {
    gridStub.getOptions.mockReturnValue({ formatterOptions: { displayNegativeNumberWithParentheses: true } } as GridOption);
    const columnDef = { id: 'column3', field: 'column3' } as Column;
    const totals = { sum: { column1: 123, column2: 345, column3: -2.4 } };
    const output = sumTotalsDollarColoredBoldFormatter(totals, columnDef, gridStub);
    expect(output).toBe('<span style="color:red; font-weight: bold;">($2.40)</span>');
  });

  it('should display a positive sum number with at least 2 decimals, even when displayNegativeNumberWithParentheses is enabled', () => {
    const totals = { sum: { column1: 123, column2: 34.5678, column3: 2.4 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1', params: { displayNegativeNumberWithParentheses: true } } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2, displayNegativeNumberWithParentheses: true } } as Column, {});

    expect(output1).toBe('<span style="color:green; font-weight: bold;">$123.00</span>');
    expect(output2).toBe('<span style="color:green; font-weight: bold;">$34.57</span>');
  });

  it('should display the same sum value in green with at least 2 decimals when a number with decimals is provided', () => {
    const totals = { sum: { column1: 123.55678, column2: 345.2, column3: -2.45 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1' } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2' } as Column, {});

    expect(output1).toBe('<span style="color:green; font-weight: bold;">$123.5568</span>');
    expect(output2).toBe('<span style="color:green; font-weight: bold;">$345.20</span>');
  });

  it('should display an sum number with user defined minimum & maximum decimal count in his grid option', () => {
    gridStub.getOptions.mockReturnValue({ formatterOptions: { minDecimal: 0, maxDecimal: 3, displayNegativeNumberWithParentheses: true } } as GridOption);
    const totals = { sum: { column1: 123.45678, column2: 345, column3: -2.45 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1' } as Column, gridStub);
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2' } as Column, gridStub);
    const output3 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column3', field: 'column3' } as Column, gridStub);

    expect(output1).toBe('<span style="color:green; font-weight: bold;">$123.457</span>');
    expect(output2).toBe('<span style="color:green; font-weight: bold;">$345</span>');
    expect(output3).toBe('<span style="color:red; font-weight: bold;">($2.45)</span>');
  });

  it('should display a sum number in correct color with at least 2 decimals when user provided minimum & maximum decimal count', () => {
    const totals = { sum: { column1: 123.45678, column2: 345.2, column3: -2.45 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1', params: { maxDecimal: 2 } } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2', params: { minDecimal: 0 } } as Column, {});
    const output3 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column3', field: 'column3', params: { minDecimal: 3, displayNegativeNumberWithParentheses: true } } as Column, {});

    expect(output1).toBe('<span style="color:green; font-weight: bold;">$123.46</span>');
    expect(output2).toBe('<span style="color:green; font-weight: bold;">$345.2</span>');
    expect(output3).toBe('<span style="color:red; font-weight: bold;">($2.450)</span>');
  });

  it('should display a sum number with at least 2 decimals with prefix and suffix', () => {
    const totals = { sum: { column1: 123.45678, column2: 345.2, column3: -2.45 } };

    const output1 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column1', field: 'column1', params: { maxDecimal: 2, groupFormatterPrefix: 'sum: ' } } as Column, {});
    const output2 = sumTotalsDollarColoredBoldFormatter(totals, { id: 'column2', field: 'column2', params: { minDecimal: 0, groupFormatterSuffix: ' (max)' } } as Column, {});
    const output3 = sumTotalsDollarColoredBoldFormatter(
      totals, {
        id: 'column3',
        field: 'column3',
        params: { minDecimal: 3, displayNegativeNumberWithParentheses: true, groupFormatterPrefix: 'sum: ', groupFormatterSuffix: '/item' }
      } as Column
    );

    expect(output1).toBe('<span style="color:green; font-weight: bold;">sum: $123.46</span>');
    expect(output2).toBe('<span style="color:green; font-weight: bold;">$345.2 (max)</span>');
    expect(output3).toBe('<span style="color:red; font-weight: bold;">sum: ($2.450)/item</span>');
  });
});