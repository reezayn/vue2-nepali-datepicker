<template>
    <div id="app">
        <header>
            <h1>Vue 2 Nepali Date Picker Demo</h1>
        </header>
        <section v-for="(example, index) in examples" :key="index" class="example">
            <h2>{{ example.title }}</h2>
            <p>{{ example.description }}</p>
            <!-- Note: We use the handler already bound in the examples array -->
            <component :is="example.component" v-bind="example.props" @date-selected="example.handler" />
            <div class="code-container">
                <pre class="code-block">{{ example.code }}</pre>
                <button class="copy-button" @click="copyCode(example.code, $event)">
                    Copy Code
                </button>
            </div>
            <pre class="output">{{ example.output }}</pre>
        </section>
        <footer>
            <div class="footer">
                Made by
                <a href="https://rijanshrestha.com.np" target="_blank">
                    Rijan Shrestha
                </a>
            </div>
        </footer>
    </div>
</template>

<script>
// import { NepaliDatePicker } from '../../src/index.js';
import { NepaliDatePicker } from 'vue2-nepali-datepicker';

export default {
    name: 'App',
    components: { NepaliDatePicker },
    data() {
        return {
            outputFormatted: '',
            outputDetailed: '',
            outputCustom: '',
            outputDisplayFormat: '',
            outputRestricted: '',
            outputInitial: '',
            examples: []
        };
    },
    methods: {
        // These methods are automatically bound to the Vue instance.
        handleDateSelectedFormatted(date) {
            this.outputFormatted = date;
            console.log('Example 1:', date);
        },
        handleDateSelectedDetailed(date) {
            // Convert the object to a pretty JSON string for display
            this.outputDetailed = JSON.stringify(date, null, 2);
            console.log('Example 2:', date);
        },
        handleDateSelectedCustom(date) {
            this.outputCustom = date;
            console.log('Example 3:', date);
        },
        handleDateSelectedDisplayFormat(date) {
            this.outputDisplayFormat = date;
            console.log('Example 4:', date);
        },
        handleDateSelectedRestricted(date) {
            this.outputRestricted = date;
            console.log('Example 5:', date);
        },
        handleDateSelectedInitial(date) {
            this.outputInitial = date;
            console.log('Example 6:', date);
        },
        // Custom return format function for Example 3.
        myCustomReturnFormat(year, month, day) {
            return `Nepali: ${day.n} of ${month}/${year}`;
        },
        // Clipboard copy function (DOM manipulation)
        copyCode(code, event) {
            if (event && event.target) {
                const originalText = event.target.innerText;
                navigator.clipboard
                    .writeText(code)
                    .then(() => {
                        event.target.innerText = 'Copied';
                        setTimeout(() => {
                            event.target.innerText = originalText;
                        }, 5000);
                    })
                    .catch(() => {
                        event.target.innerText = 'Failed';
                        setTimeout(() => {
                            event.target.innerText = originalText;
                        }, 5000);
                    });
            }
        }
    },
    created() {
        // Build the examples array.
        // Note: We reference the methods from the instance directly.
        this.examples = [
            {
                title: 'Example 1: Return Format "yyyy-mm-dd" (String)',
                description:
                    'Returns the selected date as a string in "yyyy-mm-dd" format (default display, English locale).',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: true,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Pick a Nepali Date',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    returnFormat: 'yyyy-mm-dd',
                    valueType: 'string'
                },
                // Use the already bound method from methods
                handler: this.handleDateSelectedFormatted,
                code: `<NepaliDatePicker 
      :showEnglishDate="true" 
      primaryColor="#60B7F0" 
      accentColor="#60B7F0" 
      textColor="#212121"
      placeholder="Pick a Nepali Date"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      returnFormat="yyyy-mm-dd"
      valueType="string"
      @date-selected="handleDateSelectedFormatted" />`,
                output: this.outputFormatted
            },
            {
                title: 'Example 2: Return Format "detailed" (Object)',
                description:
                    'Returns the full day object for detailed processing.',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: true,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Pick a Nepali Date (Detailed)',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    returnFormat: 'detailed',
                    valueType: 'object'
                },
                handler: this.handleDateSelectedDetailed,
                code: `<NepaliDatePicker 
      :showEnglishDate="true" 
      primaryColor="#60B7F0" 
      accentColor="#60B7F0" 
      textColor="#212121"
      placeholder="Pick a Nepali Date (Detailed)"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      returnFormat="detailed"
      valueType="object"
      @date-selected="handleDateSelectedDetailed" />`,
                output: this.outputDetailed
            },
            {
                title: 'Example 3: Custom Return Format (Function)',
                description:
                    'Uses a custom function to return a formatted string.',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: true,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Pick a Nepali Date (Custom Format)',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    // Pass the custom function directly as a prop.
                    returnFormat: this.myCustomReturnFormat,
                    valueType: 'string'
                },
                handler: this.handleDateSelectedCustom,
                code: `<NepaliDatePicker 
      :showEnglishDate="true" 
      primaryColor="#60B7F0" 
      accentColor="#60B7F0" 
      textColor="#212121"
      placeholder="Pick a Nepali Date (Custom Format)"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      :returnFormat="myCustomReturnFormat"
      valueType="string"
      @date-selected="handleDateSelectedCustom" />`,
                output: this.outputCustom
            },
            {
                title:
                    'Example 4: Custom Display Format and Locale "np"',
                description:
                    'Uses a custom display format ("yyyy{sep}mm{sep}dd") with a custom separator. Weekdays appear in Nepali.',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: false,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Custom Display Format',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    returnFormat: 'yyyy-mm-dd',
                    displayFormat: 'yyyy{sep}mm{sep}dd',
                    customSeparator: '/',
                    locale: 'np',
                    valueType: 'string'
                },
                handler: this.handleDateSelectedDisplayFormat,
                code: `<NepaliDatePicker 
      :showEnglishDate="false" 
      primaryColor="#60B7F0" 
      accentColor="#60B7F0" 
      textColor="#212121"
      placeholder="Custom Display Format"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      returnFormat="yyyy-mm-dd"
      displayFormat="yyyy{sep}mm{sep}dd"
      customSeparator="/"
      locale="np"
      valueType="string"
      @date-selected="handleDateSelectedDisplayFormat" />`,
                output: this.outputDisplayFormat
            },
            {
                title:
                    'Example 5: Using minDate and maxDate (Restricted Range)',
                description:
                    'Restricts selectable dates between the specified minDate and maxDate.',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: true,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Restricted Date Range',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    returnFormat: 'yyyy-mm-dd',
                    valueType: 'string',
                    minDate: { nepaliYear: '2070', nepaliMonth: '1', day: 1 },
                    maxDate: { nepaliYear: '2090', nepaliMonth: '12', day: 31 }
                },
                handler: this.handleDateSelectedRestricted,
                code: `<NepaliDatePicker 
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
      @date-selected="handleDateSelectedRestricted" />`,
                output: this.outputRestricted
            },
            {
                title:
                    'Example 6: Using Initial Date (Preselect and Initialize)',
                description:
                    'Initializes the date picker with a provided initial date string in the format "yyyy-mm-dd".',
                component: 'NepaliDatePicker',
                props: {
                    showEnglishDate: true,
                    primaryColor: '#60B7F0',
                    accentColor: '#60B7F0',
                    textColor: '#212121',
                    placeholder: 'Initial Date Example',
                    inputStyles: {
                        width: '300px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    },
                    returnFormat: 'yyyy-mm-dd',
                    valueType: 'string',
                    initialDate: '2085-10-25'
                },
                handler: this.handleDateSelectedInitial,
                code: `<NepaliDatePicker 
      :showEnglishDate="true" 
      primaryColor="#60B7F0" 
      accentColor="#60B7F0" 
      textColor="#212121"
      placeholder="Initial Date Example"
      :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
      returnFormat="yyyy-mm-dd"
      valueType="string"
      :initialDate="'2085-10-25'"
      @date-selected="handleDateSelectedInitial" />`,
                output: this.outputInitial
            }
        ];

        // Set up watchers so the output displayed in each example updates when its data changes.
        this.$watch('outputFormatted', (val) => {
            this.examples[0].output = val;
        });
        this.$watch('outputDetailed', (val) => {
            this.examples[1].output = val;
        });
        this.$watch('outputCustom', (val) => {
            this.examples[2].output = val;
        });
        this.$watch('outputDisplayFormat', (val) => {
            this.examples[3].output = val;
        });
        this.$watch('outputRestricted', (val) => {
            this.examples[4].output = val;
        });
        this.$watch('outputInitial', (val) => {
            this.examples[5].output = val;
        });
    }
};
</script>

<style scoped>
#app {
    padding: 20px;
    font-family: sans-serif;
    max-width: 800px;
    margin: 0 auto;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header,
footer {
    text-align: center;
}

h1 {
    margin-bottom: 20px;
}

.example {
    margin-bottom: 40px;
    padding: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
}

.example h2 {
    margin-top: 0;
    color: #333;
}

.example p {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 10px;
}

.code-container {
    position: relative;
    background: #eee;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    margin-top: 10px;
}

.code-block {
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
}

.copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #000;
    border: none;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}

.output {
    background: #ddd;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    margin-top: 10px;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 40px;
}

.footer a {
    color: #333;
}
</style>