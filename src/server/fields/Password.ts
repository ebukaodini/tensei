import Text from './Text'

export class Password extends Text {
    /**
     * When a new password is made, we'll set type
     * password as an html attribute
     *
     */
    public constructor(name: string, databaseField?: string) {
        super(name, databaseField)

        this.htmlAttributes({
            type: 'password',
        })
    }
}

export default Password