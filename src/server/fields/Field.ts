import { Request } from 'express'
import { camelCase, paramCase } from 'change-case'

interface Constructor<M> {
    new (...args: any[]): M
}

export class Field {
    public showHideField = {
        /**
         *
         * If this is true, the field will be shown on the
         * index page
         *
         */
        showOnIndex: true,

        /**
         *
         * If this is true, the field will be updatable. It will
         * show up on the update page
         *
         */
        showOnUpdate: true,

        /**
         *
         * If this is true, the field will show up on the detail page
         */
        showOnDetail: true,

        /**
         *
         * If this is true, the field will be shown on the creation
         * form
         */
        showOnCreation: true,
    }

    /**
     *
     * The name of the field. Will be used to display table columns,
     * field labels etc
     */
    public name: string

    /**
     *
     * This is a set of all html attributes to be passed
     * to this component
     *
     */
    public attributes: {} = {}

    /**
     *
     * This is a short name for the frontend component that
     * will be mounted for this field.
     */
    public component: string = `${this.constructor.name}Field`

    /**
     *
     * The database field associated with this field.
     * By default, this will be the camel case
     * version of the name
     *
     */
    public databaseField: string

    /**
     *
     * The
     */
    public helpText: string = ''

    /**
     *
     * Adds database sorting by this field. Will show up
     * on the index page, on the table headers.
     *
     */
    public isSortable: boolean = false

    /**
     *
     * Set the default value of this
     * field
     *
     */
    public defaultValue: string = ''

    /**
     * Instantiate a new field. Requires the name,
     * and optionally the corresponding database
     * field. This field if not provided will
     * default to the camel case version of
     * the name.
     */
    public constructor(name: string, databaseField?: string) {
        this.name = name

        this.databaseField = databaseField || camelCase(this.name)
    }

    /**
     *
     * Show this field on the index page
     */
    public showOnIndex(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnIndex: true,
        }

        return this
    }

    /**
     *
     * Show this field on the detail page
     */
    public showOnDetail(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnDetail: true,
        }

        return this
    }

    /**
     *
     * Show this field on the creation page
     */
    public showOnCreation(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnCreation: true,
        }

        return this
    }

    /**
     *
     * Show this field on the update page
     */
    public showOnUpdate(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnUpdate: true,
        }

        return this
    }

    /**
     *
     * Hide this field on the index page
     */
    public hideFromIndex(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnIndex: false,
        }

        return this
    }

    /**
     *
     * Hide this field from the detail page
     */
    public hideFromDetail(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnDetail: false,
        }

        return this
    }

    /**
     *
     * Hide this field from the create form
     */
    public hideWhenCreating(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnCreation: false,
        }

        return this
    }

    /**
     *
     * Hide this field from the update form
     */
    public hideWhenUpdating(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnUpdate: false,
        }

        return this
    }

    /**
     *
     * Hide this field everywhere, except the index page
     */
    public onlyOnIndex(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnIndex: true,
            showOnUpdate: false,
            showOnCreation: false,
            showOnDetail: false,
        }

        return this
    }

    /**
     *
     * Hide this field everuwhere, except the
     * create and update forms
     */
    public onlyOnForms(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnIndex: false,
            showOnUpdate: true,
            showOnCreation: true,
            showOnDetail: false,
        }

        return this
    }

    /**
     *
     * Show this field only on the detail and,
     * index pages. hidden on create and
     * update forms.
     */
    public exceptOnForms(): Field {
        this.showHideField = {
            ...this.showHideField,
            showOnIndex: true,
            showOnUpdate: false,
            showOnCreation: false,
            showOnDetail: true,
        }

        return this
    }

    /**
     * Create a new instance of the field
     * requires constructor parameters
     *
     */
    public static make<T extends Field>(
        this: Constructor<T>,
        name: string,
        databaseField?: string
    ): T {
        return new this(name, databaseField)
    }

    /**
     *
     * Make this field sortable
     *
     */
    public sortable<T extends Field>(this: T): T {
        this.isSortable = true

        return this
    }

    /**
     *
     * Define the description. This would be a help text
     * that provides more information to the user
     * about this field on forms.
     */
    public description<T extends Field>(this: T, description: string): T {
        this.helpText = description

        return this
    }

    /**
     *
     * Set the default value for this field.
     * Will show up on create forms as
     * default
     *
     */
    public default<T extends Field>(this: T, value: string): T {
        this.defaultValue = value

        return this
    }

    /**
     *
     * Set html attributes for this component
     */
    public htmlAttributes<T extends Field>(this: T, attributes: {}): T {
        this.attributes = attributes

        return this
    }

    /**
     *
     * Serializes the field for data to be sent
     * to the frontend
     *
     */
    public serialize(): any {
        return {
            ...this.showHideField,

            name: this.name,
            component: this.component,
            description: this.helpText,
            isSortable: this.isSortable,
            attributes: this.attributes,
            inputName: this.databaseField,
            defaultValue: this.defaultValue,
        }
    }
}

export default Field
