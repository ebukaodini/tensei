import ID from '../../fields/ID'
import Text from '../../fields/Text'
import Resource from '../../resources/Resource'
import Repository from 'server/database/Repository'

class Post extends Resource {}

class User extends Resource {
    displayInNavigation() {
        return false
    }

    group() {
        return 'Finance'
    }

    label() {
        return 'Department leads'
    }

    primaryKey() {
        return 'id'
    }

    public perPageOptions() {
        return [100, 250, 500]
    }
}

class PostAuthorLabel extends Resource {}

class ShoppingCart extends Resource {
    public fields() {
        return [
            ID.make().asObjectId(),
            Text.make('Name', 'first_name')
                .sortable()
                .prefix('ox')
                .suffix('ox')
                .default('beans')
                .htmlAttributes({
                    required: true,
                    email: true,
                    title: 'User first name',
                })
                .hideFromIndex()
                .hideWhenUpdating(),
        ]
    }
}

describe('Resource class', () => {
    it('Correctly serializes the resource', () => {
        const post = new Post({} as Repository)

        expect(post.serialize()).toEqual({
            label: 'Posts',
            collection: 'posts',
            displayInNavigation: true,
            group: 'All',
            primaryKey: '_id',
            param: 'posts',
            perPageOptions: [10, 25, 50, 100],
            name: 'Post',
            fields: [],
            messages: {},
        })
    })

    it('Correctly serializes the resource when properties are updated', () => {
        const user = new User({} as Repository)

        expect(user.serialize()).toEqual({
            label: 'Department leads',
            collection: 'users',
            displayInNavigation: false,
            group: 'Finance',
            primaryKey: 'id',
            perPageOptions: [100, 250, 500],
            name: 'User',
            param: 'users',
            fields: [],
            messages: {},
        })
    })

    it('serialises multiple word resources correctly', () => {
        const postAuthorLabel = new PostAuthorLabel({} as Repository)

        expect(postAuthorLabel.serialize()).toEqual({
            label: 'Post Author Labels',
            collection: 'post-author-labels',
            displayInNavigation: true,
            group: 'All',
            primaryKey: '_id',
            param: 'post-author-labels',
            perPageOptions: [10, 25, 50, 100],
            name: 'PostAuthorLabel',
            fields: [],
            messages: {},
        })

        expect(postAuthorLabel.serialize()).toMatchSnapshot()
    })

    it('correctly serializes all fields passed to resource', () => {
        const shoppingCart = new ShoppingCart({} as Repository)

        expect(shoppingCart.serialize()).toEqual({
            label: 'Shopping Carts',
            collection: 'shopping-carts',
            displayInNavigation: true,
            group: 'All',
            primaryKey: '_id',
            param: 'shopping-carts',
            perPageOptions: [10, 25, 50, 100],
            name: 'ShoppingCart',
            fields: [
                {
                    attributes: {},
                    component: 'IDField',
                    inputName: '_id',
                    defaultValue: '',
                    name: 'ID',
                    showOnCreation: false,
                    showOnDetail: true,
                    showOnIndex: true,
                    showOnUpdate: false,
                    isSortable: false,
                    asObjectId: true,
                    asString: false,
                    description: '',
                    rules: [],
                    creationRules: [],
                    updateRules: [],
                },
                {
                    attributes: {
                        required: true,
                        email: true,
                        title: 'User first name',
                    },
                    component: 'TextField',
                    inputName: 'first_name',
                    defaultValue: 'beans',
                    name: 'Name',
                    prefix: 'ox',
                    showOnCreation: true,
                    showOnDetail: true,
                    showOnIndex: false,
                    showOnUpdate: false,
                    suffix: 'ox',
                    isSortable: true,
                    description: '',
                    rules: [],
                    creationRules: [],
                    updateRules: [],
                },
            ],
            messages: {},
        })

        expect(shoppingCart.serialize()).toMatchSnapshot()
    })
})