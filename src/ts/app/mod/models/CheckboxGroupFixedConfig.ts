/**
 * This is a nearly carpon copy of the original Checkbox group. The only thing changed is how the setter functions, so default values are properly overwritten when the save data is set
 */
export class CheckboxGroupFixedConfig<TOptionValue extends primitive> implements Modding.Settings.CheckboxGroupConfig {
    private _elementValueMap: Map<HTMLInputElement, TOptionValue>;
    private _customOnChange: ((value: TOptionValue[], previousValue: TOptionValue[]) => (void | boolean | string)) | undefined;

    type: string = 'custom';
    default: TOptionValue[];
    options: Modding.Settings.CheckboxOption[];
    name: string;
    label: string;
    hint: string;

    constructor(name: string,
        label: string,
        options: Modding.Settings.CheckboxOption[],
        hint?: string,
        defaultValue?: TOptionValue[],
        onChange?: (value: TOptionValue[], previousValue: TOptionValue[]) => void | boolean | string) {
        this._elementValueMap = new Map<HTMLInputElement, TOptionValue>();

        this.name = name;
        this.label = label;
        this.hint = hint ?? '';
        this.options = options;
        this.default = defaultValue ?? [];
        if (onChange) {
            this._customOnChange = onChange;
        }
    }

    public render(name: string, onChange: () => void, config:CheckboxGroupFixedConfig<TOptionValue>): HTMLElement {
        const group = createElement('div', {
            className: 'form-group'
        });
        if (config.label || config.hint) {
            group.appendChild(InputLabel(name, config.label, config.hint));
        }

        for (let i = 0; i < config.options.length; i++) {
            const option = config.options[i];
            const optName = `${name}[${i}]`;
            const checkbox = createElement('input', {
                id: optName,
                className: 'custom-control-input',
                attributes: [
                    ['type', 'checkbox'],
                    ['name', optName],
                ],
            });
            // @ts-ignore - primitive mustn't be undefined sort of error?
            this._elementValueMap.set(checkbox, option.value);
            const label = InputLabel(optName, option.label, option.hint);
            label.classList.add('custom-control-label');
            const control = createElement('div', {
                className: 'custom-control custom-checkbox custom-control-lg mb-1',
                children: [checkbox, label],
            });
            // @ts-ignore - primitive mustn't be undefined sort of error?
            if (config.default && config.default.includes(option.value))
                checkbox.checked = true;
            checkbox.addEventListener('change', () => onChange());
            group.appendChild(control);
        }
        group.appendChild(ValidationMessage());
        return group;
    }
    public onChange(value: TOptionValue[], previousValue: TOptionValue[]): void | boolean | string {
        if (this._customOnChange) {
            return this._customOnChange(value, previousValue);
        }
    }
    public get(root: HTMLElement): TOptionValue[] {
        const checkboxes = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        const value = [] as TOptionValue[];
        // @ts-ignore We can assume that each entry is in fact TOptionValue
        checkboxes.forEach((c) => c.checked && value.push(this._elementValueMap.get(c)));
        return value;
    }
    public set(root: HTMLElement, value: TOptionValue[]): void {
        const checkboxes = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        // Fixed logic, forcibly unchecking if not matching
        checkboxes.forEach((c) => {
            // @ts-ignore We can assume that each entry is in fact TOptionValue
            if (value && value.includes(this._elementValueMap.get(c))) {
                c.checked = true;
            } else {
                c.checked = false;
            }
        });
    }

    /**
     * Parses instance to a generic object, as presumably the base game does something which doesn't do well with class structure?
     * @param instance
     */
    static toSimpleObject<TOptionValue extends primitive>(instance: CheckboxGroupFixedConfig<TOptionValue>) {
        return {
            type: 'custom',
            name: instance.name,
            label: instance.label,
            hint: instance.hint,
            default: instance.default,
            options: instance.options,

            render: instance.render.bind(instance),
            onChange: instance.onChange.bind(instance),
            get: instance.get.bind(instance),
            set: instance.set.bind(instance),
        };
    }
}

// Copied from base game

/**
 * Common input setting label, NOT the setting type 'Label'
 */
function InputLabel(name: string, label: string, hint: string | undefined) {
    const labelEl = createElement('label', {
        className: 'font-weight-normal flex-wrap justify-content-start ml-2',
        children: [label],
        attributes: [
            ['for', name]
        ],
    });
    if (hint) {
        createElement('span', {
            className: 'ms__force-wrap',
            parent: labelEl
        });
        createElement('small', {
            className: 'd-block',
            children: [hint],
            parent: labelEl
        });
    }
    return labelEl;
}
/**
 * Common validation message
 */
function ValidationMessage() {
    return createElement('small', {
        className: 'text-danger ms__validation-message validation-message ml-2',
        text: '',
    });
}