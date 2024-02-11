/*

1. Content Projection:
    <ng-content> vs props.children  

2. trackByFunc() vs keys={item.id}


3. two way binding

  [(ngModel)]  vs   let [name, setName] = useState(''); 


4. View Encapsulation(avoid component's css becoming global css which can override other component styles if class name has same name):

    Angular provides in built view encapsulation, by default its emulated. 
    React there are two ways:
        a. Use library called 'styled component'. (Its very weird lib, don't try to understand it. Its way too complex to handle simple encapsulation)
        b. Use CSS module.
            a. rename the css as 'filename.module.css'. Ex: product-list.module.css
            b. import it in js file
                    import styles from 'product-list.module.css'
            c. in html tag use it as
                <h2 className={styles.name}></h2>
                <p className={styles['product-description']}></p>      
                
    Its pretty weird to do all this for simple thing. Angular scores here     
    
5. <ng-container> Content here </ng-container>  =======> <> Content here</>


6. Getting reference to DOM element.

    ElementRef vs useRef()

    Don't do any DOM manipulation i.e don't do any write operation. If you want only to read the data from elements then go refs since to read the data from dom element by using
    state is too much boiler code.
    
    Ref Ex:
        import React, { useRef } from 'react';

        let userNameRef = useRef();

        <input ref={userNameRef}>
 
7. ViewContainerRef vs Portal (No exactly same. Portals can inject anywhere in body, however, ViewContainerRef injects code only in component's scope by using createEmbeddedView())        

8. Controlled vs uncontrolled components:
    uncontrolled component: state which manages by using refs since its values are not managing by react but through DOM's API.
    controlled component: state which manages by using React's useState().

    In context of Angular I think, Reactive form are controlled components and uncontrolled are template driven forms (through no exactly same since in template driven we use two 
        way binding). 


    useState vs useReducer : When to Use Each:

        Use useState for simple, independent state management within a component.

        Use useReducer when dealing with more complex state transitions, shared state between components, or when actions need to be dispatched from different parts of the application.

        If you find that your state management logic becomes too complex or hard to maintain with useState, consider refactoring to use useReducer.

        In general, it's a good practice to start with useState and switch to useReducer when your component's state management needs become more complex or when you want to follow a predictable state management pattern like Redux.    


*/