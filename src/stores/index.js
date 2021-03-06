// @flow

import { create } from 'mobx-persist';
import { AsyncStorage } from 'react-native';


import Counter from './Counter';
import True from './True';
import User from './User';
import Base from './Base';
import Common from './Common';

const hydrate = create({ storage: AsyncStorage });

const stores = {
    Base,
    Common,
    Counter,
    True,
    User
}

// you can hydrate stores here with mobx-persist
hydrate('Base', stores.Base);

export default {
    ...stores
};