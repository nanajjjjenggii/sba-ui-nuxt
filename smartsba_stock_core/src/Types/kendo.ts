/**
 * The type that defines the selection range of the Calendar.
 */
export interface SelectionRange {
  /**
   * The beginning of the selection range.
   */
  start: Date | null;
  /**
   * The end of the selection range.
   */
  end: Date | null;
}
/**
 * The arguments for the `onChange` event of the DateRangePicker.
 */
export interface DateRangePickerChangeEvent {
  event?: any;
  value: SelectionRange;
  show?: boolean;
  target: any;
  component?: any;
}
