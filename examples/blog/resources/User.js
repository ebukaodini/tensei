const {
    text,
    resource,
    hasMany
} = require('@flamingo/core')

const User = resource('User')
.fields([
    text('Full name').searchable().rules('required'),
    text('Email')
        .unique()
        .searchable().htmlAttributes({
            type: 'email'
        }).rules('required', 'max:32', 'email'),
    text('Password').htmlAttributes({
        type: 'password'
    }).hideWhenUpdating().hideFromIndex()
    .rules('required', 'min:8', 'max:24')
    .notNullable(),
    hasMany('Post')
])
.displayField('full_name')

module.exports = User