import React from 'react'
import { TextField } from '@contentful/forma-36-react-components'

class Text extends React.Component {
    render() {
        const {
            value,
            onFieldChange,
            field,
            errorMessage,
            ...rest
        } = this.props

        return (
            <TextField
                {...rest}
                value={value.toString()}
                id={field.inputName}
                name={field.inputName}
                name={field.inputName}
                labelText={field.name}
                textInputProps={{
                    type: field.component === 'NumberField' ? 'number' : 'text',
                }}
                validationMessage={errorMessage}
                description={field.description}
                onChange={(event) => onFieldChange(event.target.value)}
            />
        )
    }
}

export default Text
