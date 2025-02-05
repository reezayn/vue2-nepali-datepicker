# vue2-nepali-datepicker

A Vue 2 component for selecting Nepali dates. This lightweight date picker is fully configurable and allows you to customize its appearance, formatting, and behavior. It supports returning dates as formatted strings or detailed objects, restricting selectable dates, and initializing with a preselected date.

## Installation

Install via npm:

```bash
npm install vue2-nepali-datepicker
```

Make sure your project uses Vue 2 (e.g. `"vue": "^2.6.0"`) and that you have a compatible version of `vue-template-compiler` (e.g. `"vue-template-compiler": "2.6.14"`).

## Usage

Import and register the component in your Vue project:

```js
import Vue from 'vue'
import { NepaliDatePicker } from 'vue2-nepali-datepicker'

Vue.component('NepaliDatePicker', NepaliDatePicker)
```

Then, use it in your template:

```html
<template>
  <div>
    <NepaliDatePicker
      :showEnglishDate="true"
      primaryColor="#60B7F0"
      accentColor="#60B7F0"
      textColor="#212121"
      placeholder="Select a date"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      returnFormat="yyyy-mm-dd"
      valueType="string"
      :initialDate="'2085-10-25'"
      @date-selected="handleDateSelected"
    />
  </div>
</template>

<script>
  export default {
    methods: {
      handleDateSelected(selectedDate) {
        console.log('Selected Date:', selectedDate)
      },
    },
  }
</script>
```

## Props

### Appearance & Styling

- **showEnglishDate** (Boolean, default: `true`)  
  Displays the English day (day.e) below the Nepali day number if enabled.

- **primaryColor** (String, default: `"#fbc02d"`)  
  Primary color used for highlighting the selected day and (optionally) today's date indicator.

- **accentColor** (String, default: `"#ffeb3b"`)  
  Accent color for the calendar header background.

- **textColor** (String, default: `"#333"`)  
  Default text color for the component.

- **placeholder** (String, default: `"Select a date"`)  
  Placeholder text for the input field.

- **inputStyles** (Object, default: `{}`)  
  Custom CSS styles to override the default styling of the input field.

### Date Formatting & Value

- **returnFormat** (String or Function, default: `"yyyy-mm-dd"`)  
  Determines the format in which the selected date is emitted.

  - `"detailed"`: emits the full day object from the JSON data.
  - `"yyyy-mm-dd"`: emits a formatted string using the customSeparator.
  - Custom function: receives `(year, month, day)` and returns a custom value.

- **displayFormat** (String, default: `""`)  
  Format for displaying the selected date in the input field. If empty, defaults to `"day.n (metadata.np)"`.

- **valueType** (String, default: `"string"`)  
  Specifies whether the emitted value should be a string or an object. Use `"object"` to return the detailed day object.

- **customSeparator** (String, default: `"-"`)  
  Separator used in formatted date strings when tokens like `{sep}` are present in the format.

### Date Range & Initialization

- **minDate** (Object, default: `null`)  
  Sets a minimum selectable date. Expected structure:  
  `{ nepaliYear: String, nepaliMonth: String, day: String|Number }`.

- **maxDate** (Object, default: `null`)  
  Sets a maximum selectable date. Expected structure similar to minDate.

- **initialDate** (String or Object, default: `null`)  
  Preselects a date when the component is mounted.  
  If a string is provided, it must be in the format `"yyyy-mm-dd"` (Nepali date).  
  If an object is provided (legacy format), it should have the structure:  
  `{ nepaliYear: String, nepaliMonth: String, currentNepaliDay: { n: String, e: String, ... } }`.

## How It Works

- **Calendar Data:**  
  The component uses a static data loader (from `dataLoader.js`) that imports JSON files containing Nepali calendar data (from 1992 to 2100 BS). The calendar grid is built by chunking the days array into weeks.

- **Date Comparison & Formatting:**  
  Utility methods pad numbers, convert Arabic numerals to Nepali numerals, and format dates using tokens (`yyyy`, `mm`, `dd`, `nn`). The component converts dates to a comparable number for range checking.

- **Navigation & Selection:**  
  Methods `nextMonth` and `previousMonth` update the displayed month/year. Clicking a day calls `selectDay()`, which checks range restrictions, updates the selection, formats the display, and emits the selected date.

- **Today Indicator:**  
  The component computes today’s Nepali date (by matching against the JSON data) and, if the currently displayed month matches, underlines the cell for today.

## Examples

### Example 1: Return Format "yyyy-mm-dd" (String)

```html
<NepaliDatePicker
  :showEnglishDate="true"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Pick a Nepali Date"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  returnFormat="yyyy-mm-dd"
  valueType="string"
  @date-selected="handleDateSelectedFormatted"
/>
```

### Example 2: Return Format "detailed" (Object)

```html
<NepaliDatePicker
  :showEnglishDate="true"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Pick a Nepali Date (Detailed)"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  returnFormat="detailed"
  valueType="object"
  @date-selected="handleDateSelectedDetailed"
/>
```

### Example 3: Custom Return Format (Function)

```html
<NepaliDatePicker
  :showEnglishDate="true"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Pick a Nepali Date (Custom Format)"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  :returnFormat="myCustomReturnFormat"
  valueType="string"
  @date-selected="handleDateSelectedCustom"
/>
```

In your methods:

```js
myCustomReturnFormat(year, month, day) {
  return `Nepali: ${day.n} of ${month}/${year}`;
}
```

### Example 4: Custom Display Format and Locale "np"

```html
<NepaliDatePicker
  :showEnglishDate="false"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Custom Display Format"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  returnFormat="yyyy-mm-dd"
  displayFormat="yyyy{sep}mm{sep}dd"
  customSeparator="/"
  locale="en"
  valueType="string"
  @date-selected="handleDateSelectedDisplayFormat"
/>
```

### Example 5: Using minDate and maxDate (Restricted Range)

```html
<NepaliDatePicker
  :showEnglishDate="true"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Restricted Date Range"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  returnFormat="yyyy-mm-dd"
  valueType="string"
  :minDate="{ nepaliYear: '2070', nepaliMonth: '1', day: 1 }"
  :maxDate="{ nepaliYear: '2090', nepaliMonth: '12', day: 31 }"
  @date-selected="handleDateSelectedRestricted"
/>
```

### Example 6: Using Initial Date (Preselect and Initialize)

```html
<NepaliDatePicker
  :showEnglishDate="true"
  primaryColor="#60B7F0"
  accentColor="#60B7F0"
  textColor="#212121"
  placeholder="Initial Date Example"
  :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
  returnFormat="yyyy-mm-dd"
  valueType="string"
  :initialDate="'2085-10-25'"
  @date-selected="handleDateSelectedInitial"
/>
```

In your methods:

```js
handleDateSelectedInitial(initialDate) {
  console.log('Example 6 - Selected date (initial date demo):', initialDate);
}
```

## License

MIT

## Contributing

Feel free to open issues or submit pull requests if you encounter any bugs or have feature suggestions.
