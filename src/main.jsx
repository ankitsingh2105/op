import React from 'react';
import Firebase from './newCart/firebase';
import {createRoot} from "react-dom/client";
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Firebase />
  </React.StrictMode>
);
{/* <Provider store={store}>
<NavBar/>
  <Cart/>
</Provider> */}
