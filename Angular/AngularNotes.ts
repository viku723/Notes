/** SOLID Principle in Angular
  a. Single responsibility: A class/component should do exactly one thing. Adding multiple feature is not a good idea.
  b. Open/Close principle: A Class should be open for extension and closed for modification.
     ex: class Shape { }
	     class Circle extends Shape {}
		 class Square extends Shape {}
  c. Liskov Substitution Principle:
        Subclass can be used in place of its parent class without causing unexpected behavior. 
        ex: 
        class Bird {
            fly() {
                // common fly behavior
            }
        }

        class Penguin extends Bird {
            fly {
                // penguin cannot fly, override with different behavior.
            }
        }

        Penguin class should not override fly(). Solution is refactor hierarchy or use interface to better represent.

  d. Interface seggregation principle: In interface should divided into smaller ones so that a class doesn't need to implement methods which doesn't require.
  e. Dependency inversion principle: High level modules should not depend on low level modules but should depend on abstraction. In other words, classes should 
     depend on abstraction rather than implementation. 
     Ex: 

     class GenerateReport {
        private db: DataBase;
        constructor() {
           this.db = new DataBase(); // Here GenerateReport class is depend on concrete implementation of DataBase which violates the principle.
        }

        generateReport() {
            let data = this.db.getData();
            //generate report
            return data;
        }
     }

     Here it should like this:
     class GenerateReport {
        private db: DataBase;
        constructor(private db: DataBase) { } // so ti give an instance of DataBase is someone else's job (like framework)

        generateReport() {
            let data = this.db.getData();
            //generate report
            return data;
        }
     }

     In Angular Context example(https://youtu.be/Y-MRJ9QYCvI?si=XIeKwHL2wOP25kMw&t=1987): 
     
     class ParentComponent {
        @ViewChild(ChildComponent) childComponent: ChildComponent; // Here we are completely depend on child class which violetes depedency inversion pricnicple
        ngAfterViewInit() {
            this.childComponent.reload();
        }
     }

     class ChildComponent {
        reload() {
            // reload component;
        }
     }

     Solution would be creating injecting token by using interface;
     
     interface Reload {
        reload(): void
     }
     let reloadComponent = new InjectionToken<Reload>('reload-component');

     @Component({
        provide: [{
            provide: reloadComponent,
            useExisting: ChildComponent
        }]
     })
     class ChildComponent implements Reload {
        reload() {
            // reload component;
        }
     }

     class ParentComponent {
        @ViewChild(reloadComponent) childComponent: Reload;
        ngAfterViewInit() {
            this.childComponent.reload();
        }
     }

What is tree shaking?
=> Removing of dead code which is not using by the app to reduce the bundle size. This is done by webpack while production build. 
   If you use ContentChild or ViewChild for a component which is not rendered through selector or route then CLI tool not able to remove this dead
   component.
    
   ex: Normal case: 
    
    <app-component>
        <widget-component></widget-compoent>
    <app-component>
        
    in app-coponent.ts file
    @ContentChild(WidgetComponent) comp;

    Now, Remove <widget-component>

    <app-component> <app-component>

   Now, even though there is no reference for widget-component, it will be still added to bundle.

   To, Solve this issue, we should use injection token like below

   WidgetComponent.ts:

       export let widgetToken = new InjectionToken<WidgetComponent>('widget-token');

        @Component({
            provide: widgetToken, useExisting: WidgetComponent
        })
        class WidgetComponent { }

   App.component.ts :
        @ContentChild(widgetToken) comp;
   


 forRoot() vs forChild()
 
 => 

 What is the diffrence between RouterModule.forRoot() vs RouterModule.forChild()? Why is it important?
    forRoot creates a module that contains all the directives, the given routes, and the router service itself.
    forChild creates a module that contains all the directives and the given routes, but does not include the router service. It registers the routers and uses the router service 
    created at the root level. This is important because location is a mutable global property. Having more than one object manipulating the location is not a good idea.



How do you increase Angular performance?
=> a. Instead of calling component methods from templates (which triggers every change detection) either use pure pipe or do all manipulation in
      component and assign that to a class variable or use or Memorization.(https://www.youtube.com/watch?v=YsOf90RZfss&list=PLX7eV3JL9sfk0tbUkZwGCD1Y-kJ05NvOR&index=5) 
   b. While creating a utils, instead of creating a class and adding static methods, create functions and export them so that it will be tree shaking.
      for example: if you total 10 util methods and you are going to use only 5 methods in your app then angular imports only those 5 methods, so that bundle size is less. If you had 
      created a Class with static methods then it would have imported all the methods even though you are using only 5.
   c. Don't do DOM manipulation through native methods like querySelector, getElementByID etc instead use angular's renderer2 library. This will enhance the performance as well as
      security.
   d. Use trackBy with *ngFor so that its doesn't re-render the items. By default tracks each item by object refrence even though object contents are same.
          We need to provide a function name which returns object uniue values(usually primary key)
          ex: *ngFor="let item of items; trackBy: trackByFunc"
              trackByFunc(index, item) {
                  item ? item.id: undefined
              }
           Use this only there is performance issue otherwise simply you are going add more code   

    e. Use SourceMapExplorer pluginn: Which tell use which lib/module is having large size
           usually the libray's doesn't support es6 modularization(import/export) will load all the code for ex:
           import * as moment ''moment;
           import * as _ 'loadhash; // So instead use 'loadhash-es'
     
           we need only need one ore 2 methods but endup importing all the methods. Always use tree shakable libraries.    
           
    f. Skip CHange Detection(onPush, RunOutside angualr zone(Avoid zone pollution))
          i. Zone Pollution: Usually occurs in 3rd party libraries. Every time there is change in library, Angular run change detection which cause performance issue.
             Solution is inject zone and call 3rd party methods in zone.runOutsideAngular()
          ii. Change detection strategy OnPuSH: Angular runs change detection only when you pass new value to component based on equality check. You need to immutable object and 
              arrays to compon to trigeer change detetation.
              ex: {changeDetetction: ChangeDetectionStragey.onPush}
              So run change detection manually by using delectChanges() or markForCheck()   
    
    g. Render fewer elements by using pagination .
    h. Avoid many *ngIfs, ngSwitches in templates and use dynamic components by using dynamic factory resolver.
    i. Use Web workers for heavy calculation and Poller.    
    j. Use of gzip(gunzip) compressor at server side, which enables compression of bundle size, css and other media files.    
       
      

What is forwardRef()?
=> Allows to refer to references which are not yet defined. In other words, whenever a service injecting to another service or component, its declared 
   but not defined. In that case, it will throw an error "can't resolve all params". To resolve we have to use forward ref.
   
   Ex: Both classes is defined in same file say service.ts

        class serviceA {
            constructor(private serviceB: ServiceB) {}
        }

        class serviceB {  }
    
    So here serviceB get hoisted to top of current file, like "var serviceB" however, its not initialized. That's why it throws error.
   
    To resolve it:
        class serviceA {
            constructor(@Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB) {}
        }
    
    NOTE: It's better way to organize your code in such a way that "ONE CLASS PER ONE FILE"  
 

Angular Dependency Injection – Understanding hierarchical injectors
=> What is DI?
   -> Its design principle where a class asks for dependency from external source instead of creating one. It allows decoupling code.
   
   Injector Hierarchy:
     a. NullInjector: It throws error if Angular tries to find a server here.
     b. PlatformModule: Created when we call platformBrowserDynamic().
     c. RootInjector: Whenever Angular app boostraps, it loads all services from providers from app module, eagerly loaded modules and "{providedIn: 'root'}" and
        stores them in RootInjector.
     d. ChildInjector: Injector being created for every lazy loaded module. So, if you define "ServiceA" in app module/eagerly loaded module and lazy
        loaded module then you would have 2 instances of "ServiceA".
     e. Element Injector: Services which defined in Component or Directive(added in "providers" property).

     Ok, now take few scenario:

     i. ServiceB declared in a component
        
        @Component({
            providers:[ServiceB]
        })
        class ParentComponent {}
        class ChildComponent { 
            constructor(private serviceB: ServiceB)
        }

        Heptarchy => ChildElementInjector -> ElementInjector <=> ServiceB
    
     ii. ServiceB declared in a n Eagerly loaded module 
        
        @NgModule({
            providers:[ServiceB]
        })
        class ModuleXYZ {
            
        }
        class ParentComponent {}
        class ChildComponent { 
            constructor(private serviceB: ServiceB)
        }

        Heptarchy => ChildElementInjector -> ElementInjector -> RootInjector <=> ServiceB 
        
        NOTE: This scenario is same as {providedIn: 'root'}
    
     Iii. ServiceB declared in a Lazy loaded module 
        
        @NgModule({
            providers:[ServiceB]
        })
        class ModuleLazyLoaded { }
        class ParentComponent {}
        class ChildComponent { 
            constructor(private serviceB: ServiceB)
        }

        Heptarchy => ChildElementInjector -> ElementInjector -> ChildInjector <=> ServiceB    
     
     iv: ServiceB nowhere declared
         Heptarchy => ChildElementInjector -> ElementInjector -> ChildInjector(lets say child component in lazy module) -> RootInjector -> PlatformModule -> NullInjector <=> Throws null injector error 
         Note: To avoid throwing error which causes app break, just use @Optional Resolution modifier while injecting service.
     
     Note: new service instance is created for same service in following scenario
        a. The same Service provided in each component get new instance by each component.
        b. The same Service provided in eager module and component then new instance by component and app level instance from module provider.
        c. The same service provided in eager and lazy module.
         
    
    
    
    Resolution modifiers:
      a. @Optional =>  Use to avoid throwing "null injector - no provider for ServiceA" error when Service is not defined anywhere. 
      b. @Self => It will try to get Service from its own Injector , ex. ChildInjector, ElementInjector etc.
                  Ex: If you provide a service in app module and inject that service in a component with @Self then it throws error since it couldn't
                      find the service in ElementInjector.
      c. @SkipSelf => Its opposite of @Self  
      d. @Host => Similar to @Skip but @Host checks for the dependency in the current template.
                  Ex: In the template of ChildComponent, we have added GrandChildComponent.
                    child.component.ts
                    @Component({
                    selector: "my-child",
                    providers: [],
                    viewProviders: [],
                    template: `
                        <div class="box">
                        <p>ChildComponent => {{ randomNo }}</p>
                    
                        <my-grandChild></my-grandChild>
                        </div>
                    `
                    })
                    export class ChildComponent {
                    
                    Now, go to the GrandChildComponent and add the @Host decorator on the randomService
                    export class GrandChildComponent {
                    randomNo;
                    constructor(@Host() private randomService: RandomService) {
                        this.randomNo = randomService?.RandomNo;
                    }
                    }
                    
                    Immidetaly you will see the message.

                    No provider for RandomService found in NodeInjector

                    The GrandChildComponent is part of the following template of ChildComponent. This Template is hosted inside the ChildComponent. Hence ChildComponent is the host component.
                        <div class="box">
                        <p>ChildComponent => {{ randomNo }}</p>
                    
                        <my-grandChild></my-grandChild>
                        </div>
                    
                    @Host first looks for the Dependency in the template. It starts with the Providers of the GrandChildComponent.

                    Next, it will move to ChildComponent, which is the Host Component. Here it will only look in the ViewProviders and not in Providers array.

                    Hence there are two ways in which you can remove this error

                    Add the RandomService to the Providers of the GrandChildComponent. Because that is where DI looks first for dependency.

                    The second option is to add RandomService to viewProviders array of the ChildComponent.
                    
 
                    
 Dependency providers like useClass, useExistiong, useValue, and use factory.  
 => 
    "providers: [ProductService]"" is an actual shorthand notation for the following syntax
    providers :[{ provide: ProductService, useClass: ProductService }]
    "provide": The first property is Provide holds the Token or DI Token. The Injector uses the token to locate the provider in the Providers array.
             The Token can be either a type, a string or an instance of InjectionToken.
    "provider": The second property is the Provider definition object. It tells Angular how to create the instance of the dependency. 
                The Angular can create the instance of the dependency in four different ways. 
                (https://www.tektutorialshub.com/angular/angular-providers/#:~:text=The%20Provider%20also%20tells%20the,Aliased%20Class%20Provider%20(%20useExisting).)        

    a. useClass: Creates a new instance if the service.  It is similar to calling the new operator and returning instance. 
                 Useful when you want to replace a service but don't want to change in all the places.
              ex: You are already using LoggerService throught your app and its provided in your app.module. Now, lets say, you have NewLoggerService
                  which is more advanced that existing service then replacing everywhere is hectic job. Simple way is:
                  
                  Providers:[
                    ...,
                    {
                        provide: LoggerService,
                        useClass: NewLoggerService
                    }
                  ]
    
    b. useExisting: Uses already existed service or creates a new one.  
    c. useValue: You can load plain javascript object/string/boolean etc. as a service. It is useful in scenarios like, where you want to provide 
                 API URL, application-wide configuration Option, etc
    d. useFactory: its callback method 

    Note: @Inject() need to use when injecting a dependency which is has DI token as string or InjectionToken instance(to ensure that the Unique tokens are created).
          ex: i. as string
           {
            provide: "ServiceBasAStringToken",
            provider: ServiceB
           }
           ===> constructor(@Inject('ServiceBasAStringToken') serviceB: ServiceB)

           ii. as an InjectionToken instance
              
              let tokenServiceB = new InjectionToken<ServiceB>('serviceBasTokenExample');
              ===> {
                provide: tokenServiceB, userClass: ServiceB
              }
              ===> constructor(@Inject(tokenServiceB) serviceB: ServiceB)

    Note: Multiple Providers with the same token
        You can add as many dependencies to the Providers array.
        The Injector does not complain, if you add more than one provider with the same token
        For example, NgModule below adds both ProductService & FakeProductService using the same token ProductService. 
        @NgModule({
        ... 
        providers: [
            { provide: ProductService, useClass: ProductService },
            { provide: ProductService, useClass: FakeProductService },
        
        ]
        })
        export class AppModule {}
        In such a scenario, the last to register wins. The ProductService token always injects FakeProductService because we register it last.

        However, If you multi: true then it will give you array of injected dependency.
        ex:
           providers: [
            { provide: ProductService, useClass: ProductService, multi: true },
            { provide: ProductService, useClass: FakeProductService,  multi: true },
        ]

        constructor(@Inject(ProductService) productServices: ReadOnlyArray<ProductService>) {}
        ngOnInt() {
            this.productServices.forEach(...)
        }

        Few references where multi: true uses is APP_INITIALIZER, HTTP_INTERCEPTOR tokens


Angular 14 new features:
 a. Standalone components
 b. Typed forms 
 c. Changes in inject(): Makes inheritance simplification(As no need to inject dependencies in constructor). Its allowed only in constructor or class variables.
                        ex: constructor(productService: ProductService) {} ==> productService = inject(ProductService)
                                                                               constructor() {}
 d. Providers[] in routes config. Its new injector called it as RouterInjector which sits in between node/element injector and module injector.
 
 

APP_INITIALIZER token useful during app initializes like fetching config data. 
ex: app.module.ts
    
    @NgModule({
        providers: [
            {
                provide: APP_INITIALIZER,
                multi: true,
                useFactory: loadConfig,
                deps:[HttpService]
            }
        ]
    })

    function loadConfig(httpService: HttpService) {
        //get data from service and store the config data.
    }


Change Detection:
  a. View Checking: 
        By default view checking is enabled. To disable it, 
                    i. Component level:ChangeDetectionStratergy.ONPUSH
                    ii.App level: platformBrowserDynamic().bootstrapModule(AppModule, {ngZone: 'noop'})  
        If you disable it then you have to do this.cdr(ChangeDetectionRef).detectChanges() to sync model with view to update it.
        View checking happens from top to bottom componenets. AppRef.tick() loops through all the views and call detectChanges() method.

  
  b. The Role of ZoneJS:
        Whenever Angular boostraps main module, it creates an instance of ngZone. Which is execution context for Angular.
        State change can happen in following cases(any async)
        1. setTimeout, setInterval
        2. handling events click, focus, mouseover etc. However, this does not mean that if you click anywhere in app and trigger change detection.
            To trigger change detection in these scenarios:
                a. event should be registered in ngZone(ex. (click)="something()")
                b. event handler should be defined in model/component class. i.e something() { ... } 
        3. http request completes.  
    In all these scenarios, zoneJs notifies to Angular about the state changes. ZoneJs does this by using monkey patching. ZoneJS doesn't know actually
    whether state changed or not. It just notify Angular that state might have changed please do view checking(i.e run change detection).  
  
  c. ChangeDetectionStratergy.ONPUSH: Instead of telling state change by zoneJS, the compoenent itself ask Angualr to run change detection whenever 
        there is state change in component by using detectChanges(), markForCheck() etc.

markForCheck() vs detectChanges():
      markForCheck(): doesn't trigger change detection immediately. Its just marks the compoenent dirty and in next change detetion cycle it performs CD
      in that component.
      detectChanges(): triggers CD immediately.

Angular marks components(ONPUSH) dirty automatically in following cases.
  a. Input propery changes. So, if object is passed as input property to component then it has to be immutable way to pass it.
  b. when you use async pipe.
  c. @Output()      



Angular Router to navigate from one view to another view in Angular:

    Angular Supports PathlocationStrategy and HashLocationStrategy.

    Angular supports two Location Strategies:
    HashLocationStrategy
    Where URL looks like http://localhost:4200/#/product
    PathLocationStrategy
    Where URL looks like http://localhost:4200/product

    PathLocationStrategy: The PathLocationStrategy is the default strategy in the Angular application. To Configure the strategy, 
    we need to add <base href> in the <head> section of the root page (index.html) of our application 
    <base href="/">

    HashLocationStrategy: You can use the HashLocationStrategy by providing the useHash: true in an object as the second argument of the 
    RouterModule.forRoot in the AppModule.
    RouterModule.forRoot(appRoutes, { useHash: true }

    Recommend you use the HTML 5 style (PathLocationStrategy ) as your location strategy.Because It produces clean and SEO Friendly URLs that 
    are easier for users to understand and remember. You can take advantage of the server-side rendering, which will make our application 
    load faster, by rendering the pages in the server first before delivering them the client.

    Pass parameters to the route: 
        { path: 'product/:id', component: ProductDetailComponent } ==> <a [routerLink]="['/Product', ‘2’]">{{product.name}} </a>
        { path: 'product/:id/:id1/:id2', component: ProductDetailComponent } ==> 
     
        routeToProductDetail() {     
            this.router.navigate(
            ['/products'. product.productID] }
        ); 

        Retrieve Param in component:
         i. snapshot: this.id=this._Activatedroute.snapshot.params["id"];
         ii. Using observables(recommnded to use):
                this._Activatedroute.params.subscribe(params => { 
                    this.id = params['id']; 
                });
    
    Child Route: 
        { path: 'product', component: ProductComponent,
            children: [
                { path: 'detail/:id', component: ProductDetailComponent }
            ],  
       In product.component.html: <router-outlet></router-outlet>


       export const appRoutes: Routes = [
            { path: 'home', component: HomeComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'product', component: ProductComponent, 
                children: [
                    { path: 'detail/:id', component: ProductDetailComponent, 
                        children : [
                            { path: 'overview', component: ProductOverviewComponent },
                            { path: 'spec', component: ProductSpecComponent },  
                            { path: '', redirectTo:'overview', pathMatch:"full" }
                        ]
                    }
                ]
                },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', component: ErrorComponent }
            ];
            
            The first two child routes are simple. ‘Overview’ path is associated with ProductOverviewComponent & ‘spec’ URL path is associated with the ProductSpecComponent

            The Url would become ‘/product/detail/:id/overview’ and ‘/product/detail/:id/spec’
               
        }
    Query Parameters:
        <a [routerLink]="['products']" [queryParams]="{ color:'blue' , sort:'name'}">Products</a>
        this.router.navigate(
            ['/products'], 
            { queryParams: { page: 2, sort:'name'} }
        ); 

        this.sub = this.Activatedroute.queryParams.subscribe(params => {
            this.pageNum = +params.['pageNum']||0;     
        });

        queryParamsHandling: The query parameter is lost when the user navigates to another route. You can change this behavior by configuring 
        the queryParamsHandling strategy. This Configuration strategy determines how the angular router handles query parameters when the user
        navigates away from the current route. It has three options
        a. “”: This is the default option. The angular removes the query parameter from the URL when navigating to the next route.
        b. preserve: carries forwards the query parameter of the current route to the next navigation
        c. merge
    
    router.navigate method and relative path: 
        navigate method always uses the absolute path. To make Navigate method work with a relative path, we must let know the router where 
        are we in the route tree. This is done by setting the relativeTo Property to the ActivatedRoute as shown below
        this._router.navigate(['detail'], { queryParams: { pageNum: this.pageNum + 1 }, relativeTo: this._Activatedroute } )   
        RouterLink directive by default is relative path.

        Absolute Path Vs Relative Path Which one to Use?
            It is recommended to use the Relative path. Using an absolute path breaks our code if the parent URL structure changes.
     

Angular Guards:
     CanActivate, CanDeactivate, Resolve, CanLoad, and CanActivateChild
     
     Uses of  Angular Route Guards
        a. Asking whether to save before moving away from a view
        b. Authorization: Allow access to certain parts of the application to specific users
        c. Validation: Validating the route parameters before navigating to the route Fetching some data before you display the component.
        d. Fetching some data before you display the component.

    1. canActivate: This guard is useful in the circumstance where the user is not authorized to navigate to the target component. Or the user 
        might not be logged into the system.
    2. CanDeactivate: This Guard decides if the user can leave the component (navigate away from the current route). This route is useful in where the user might have some pending changes, which was not saved
    3. Resolve: This guard delays the activation of the route until some tasks are complete. You can use the guard to pre-fetch the data from the 
                backend API, before activating the route.
                  { path: 'product2', component: Product2Component, resolve: {products: ProductListResolverService}  },
    4. CanLoad: This guard works similar to CanActivate guard with one difference. The CanActivate guard prevents a particular route being accessed. 
                The CanLoad prevents entire lazy loaded module from being downloaded, Hence protecting all the routes within that module.
    5. CanActivateChild: This guard determines whether a child route can be activated. This guard is very similar to CanActivateGuard. 
                        We apply this guard to the parent route. 
                        
    Usage in code:
        { 
            path: 'product', 
            component: ProductComponent, 
            canActivate : [ProductGuardService, AnotherProductGuardService ] 
        }                    
    Order Of Execution(if all guards used against a route): CanDeactivate -> CanActivateChild -> canActivate -> CanLoad -> Resolve
    
    If you applying same guards to the sibling, then create an empty path route.
    ==> {
            path: '',
            canActivate: [authGuard],
            children: [
                {
                    path: 'order',
                    component: OrderComponent
                    //canActivate: [authGuard] // moved to top since duplicated

                },
                {
                    path: 'Product',
                    component: ProductComponent,
                    //canActivate: [authGuard] // moved to top since duplicated
                }
            ]
        }

    Passing static data to a route:
        We can configure the static data at the time of defining the route. This is done by using the Angular route data property of the route. 
        ex: { path: 'static', component: StaticComponent, data :{ id:'1', name:"Angular"}},
            ngOnInit() {
                this.activatedroute.data.subscribe(data => {
                    this.product=data;
                })
            }
    
    RouterLinkActive: 
    Using this directive, we can toggle CSS classes for active Router Links based on the current RouterState.use case of this directive is to highlight which route is currently active
    <li><a [routerLink]="['home']" routerLinkActive="active">Home</a></li>
        

Router Events:
    NavigationStart: the Angular router stats the navigation.
    NavigationEnd:	navigation ends successfully.
    NavigationError: 
    ResolveStart:
    ResolveEnd:
    Guard Related events:

    ex: this.router.events.subscribe((event: NavigationEvent) => {
            if(event instanceof NavigationStart) {
                console.log(event);
            }
        });
 
forRoot vs forChild:
The RouterModule contans several components. it also includes the several Services. The services provided in the Root Module or in any of the eagerly
loaded feature modules  are app-scoped. i.e they are available for injection in every component in the app. This rule does not apply to the lazy 
loaded modules. The lazy loaded modules gets their own injector and providers. The services provided in the lazy loaded modules are available only 
in the lazy loaded module only. Now, consider the case where RouterModule is imported in a lazy loaded module. This will create the separate instance
of the Router service in the lazy loaded module. This will have untended bugs as there should only a single instance of the Router service in the app.  
We need to register the services only in the AppModule and not in the Lazy loaded module. The forRoot method imports RouterModule and registers all 
its services. Hence it is used in the root module. The forChild method imports RouterModule but does not registers its services. 
Hence it should be all other modules.

Summary: RouterService gets another instance if we define routes in lazy loaded modules. To avoid, we must specify forRoot() and forChild() static
         methods. This creates single instance of the service.

Angular Folder Structure Best Practices:
        The Angular uses the concept of Angular Modules to group together the related features. This gives us a nice starting point to organize the 
        folder structure. Each Module should get its own folder named after the Module Name.

        a. Root Module: The Angular requires one module to be loaded as the application starts.  The root module is conventionally called as AppModule and created under the  /src/app.folder
        b. Feature Module: The Features module implements a specific feature of the Application. .src/app/{FeatureModule}
                        ex: src
                                - app
                                    - OrderModule
                                        + Components 
                                        + Pipes
                                        + Directives
                                        + Services
                                        Order.module.ts
                                        Order.route.module.ts
        c. Shared Module: There are many components, directives & pipes, which we may like to share across various modules. The shared module and 
                        must declare the components, pipes, and directives using the declarations metadata and export it using the exports metadata
        d. Core Module: The Services shared across the application must become part of the CoreModule. The user authentication services, services that fetch data are examples of such services.


Lazy Loading:
     {path: "admin", loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)} 
     The lazy loaded module loads only for the first visit of the URL, it will not load when we revisit that URL again.
     The Angular creates a separate injector for the lazy loaded module. Therefore, any service we provide in the lazy loaded module gets its own instance of the service.       

What is Angular Preloading Strategy ?
    Preloading in Angular means loading the Lazy loaded Modules in the background asynchronously, while user is interacting with the app. 
    This will help boost up the loading time of the app.
    
    How to enable:
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}) 
        Preloading Strategies:
        i. NoPreloading: This will disables all the preloading. This is default behavior 
        ii. PreloadAllModules: This strategy will preload all the lazy loaded modules. 
        iii. You can define custom preload Strategies

Content projection is a way to pass the HTML content from the parent component to the child component.

    Multiple Projections using ng-content:
        <ng-content select="header" ></ng-content>
        <ng-content select="content" ></ng-content>
 
ng-container in Angular. We use this to create a dummy section in the template, without rendering it in the HTML. 
This is a pretty useful feature while we work with the structural directives like ngIf, ngFor & ngSwitch.      

The <ng-template>:
    is an Angular element, which contains the template. A template is an HTML snippet. The template does not render itself on DOM.
        There are few ways you can display the template.
            i. ngTemplateOutlet directive.
                <ng-template #sayHelloTemplate>
                    <p> Say Hello</p>
                </ng-template>
                <ng-container *ngTemplateOutlet="sayHelloTemplate">
                    This text is not displayed
                </ng-container>
            ii. TemplateRef & ViewContainerRef
                    @ViewChild('sayHelloTemplate', { read: TemplateRef }) sayHelloTemplate:TemplateRef<any>;

                    constructor(private vref:ViewContainerRef) { }
                    ngAfterViewInit() {
                        this.vref.createEmbeddedView(this.sayHelloTemplate);
                    }

                    
ViewChild:
    The ViewChild query returns the first matching element from the DOM and updates the component variable on which we apply it.  
    ex:
        <child-component #child></child-component>
         @ViewChild("child", { static: true }) child: ChildComponent;
       Here { static: true } mean child-component always available(So here in ngAfterViewInit() this.child exist). 
       and false means depends on some condition(So here in ngAfterViewInit() this.child is undefined) for ex:
        <child-component #child *ngIf="SomeCondition"></child-component>
        ngAfterViewInit(): void {
            console.log(this.child);
        }
ViewChildren:
    ViewChildren decorator is used to getting the list of element references from the View. ViewChildren is different from the ViewChild. 
    ViewChild always returns the reference to a single element. If there are multiple elements the ViewChild returns the first matching element, 
    ViewChildren always returns all the elements as a QueryList. You can iterate through the list and access each element.
    The ViewChildren is always resolved after the change detection is run. i.e why it does not have static option. And also you cannot refer 
    to it in the ngOnInit hook as it is yet to initialize.

Why not ElementRef?
    We can use the nativeElement property of the ElelemtRef to manipulate the DOM.  
    a. it bypass change detection. 
    b. do not sanitize the data
    
    Thats why always recommend to use Renderer2 for DOM manipulation

The ContentChild & ContentChildren are decorators, which we use to Query and get the reference to the Projected Content in the DOM. 
Projected content is the content that this component receives from a parent component.


RXJS:
    of: It multiple arguments
        of(1,2,3).subscribe(console.log) => 1,2,3
        of(1,[2,3,4]).subscribe(console.log) => 1,[2,3,4]
    
    from: It only one argument   
         from([1,2,3]).subscribe(console.log) => 1,2,3
         from("hello world").subscribe(console.log) => h,e,l,l,o,'',w...
    
    fromEvent:
        const source = fromEvent(window, 'scroll');
        source.subscribe(val => console.log(val));  
        
        fromEvent(this.button.nativeElement, 'click')
        .pipe(debounceTime(300))
        .subscribe(res => console.log(res));
    
    Pipe Operators:
        tap:  does not modify the stream

        SwitchMap:  It creates a new inner observable for every value it receives from the Source. Whenever it creates a new inner observable 
        it unsubscribes from all the previously created inner observables. Basically it switches to the newest observable discarding all other.  
        
        Ex:
            let srcObservable= of(1,2,3,4)
            let innerObservable= of('A','B','C','D')
            
            srcObservable.pipe(
            switchMap( val => {
                console.log('starting new observable')
                return innerObservable
            })
            )
            .subscribe(ret=> {
            console.log('Recd ' + ret);
            })

            o/p:
            starting new observable
            Recd A
            Recd B
            Recd C
            Recd D
            starting new observable
            Recd A
            Recd B
            Recd C
            Recd D
            starting new observable
            Recd A
            Recd B
            Recd C
            Recd D
            starting new observable
            Recd A
            Recd B
            Recd C
            Recd D

        Using SwitchMap in Angular:
        1.
            ngOnInit() {
                this.activatedRoute.paramMap
                .pipe(
                    switchMap((params: Params) => {
                        return this.service.getProduct(params.get('id'))
                    }))
                .subscribe((product: Product) => this.product = product);
            }
        2.    
            this.mainForm.get("productCode").valueChanges
            .pipe(
                debounceTime(700),
                switchMap(val => {
                    return this.queryDepositData();
                })
            )
            .subscribe(data => {
                this.product=data;
            })
        
        debounceTime(): emits the latest value after a pause/delay from when the latest value was emitted. A popular use case for debounceTime() 
        is to control when a user's input is "accepted" as to only take the last emitted value after a user pauses typing after a 
        specified amount of time.  
        
        Ex: when user typing "abcd" withing 100ms then it emits "d" only.

        throttleTime() is similar to debounceTime(). The difference is that throttleTime() emits a value first, 
        then ignores values during a timed window and continues to repeat this pattern, whereas debounceTime() does not emit a 
        value before the delayed windows start.

        Ex: when user typing "abcd" withing 100ms then it emits "a" only and ignores "bcd" in mean time.

        mergeMap:
            It creates a new inner observable for every value it receives from the Source. Unlike SwitchMap, MergeMap does not 
            cancel any of its inner observables. It merges the values from all of its inner observables and emits the values back into the stream.
        
        concatMap:
            It is Similar to MergeMap except for one difference that it maintains the order of its inner observables.
        
        ExhaustMap:
            creates and waits for inner observable before resuming.  
        
        Take:
            Take operator emits the first n number of values before completing. 
            ex: obs = of(1, 2, 3, 4, 5).pipe(take(2)).subscribe(console.log) => 1,2;

        takeUntil:
            operator returns an Observable that emits value from the source Observable until the notifier Observable emits a value.
        
        takeWhile:
            evenNumbers = of(2, 4, 6, 3, 8)
            .pipe(takeWhile(n => n % 2 == 0))
            .subscribe(val => console.log(val));
            
            **Console ***
            2
            4
            6    
        
        TakeWhile Vs Filter
            Both takeWhile & filter uses the condition to filter out the incoming stream. Both allows only the matching values to pass through 
            discarding the others. The difference is that takeWhile discards the rest of the stream, when it receives the first value that 
            does not satisfy the condition (If the inclusive is set to true, then it also emits the last value even when it does not satisfy the
            condition). The filter operator never stops the observable. 
        
        ReplaySubject:
            ReplaySubject replays old values to new subscribers when they first subscribe. The ReplaySubject will store every value it emits in a 
            buffer. It will emit them to the new subscribers in the order it received them. You can configure the buffer using the arguments
            bufferSize and windowTime .

            bufferSize: No of items that ReplaySubject will keep in its buffer. It defaults to infinity.
            windowTime: The amount of time to keep the value in the buffer. Defaults to infinity. 




Handling Errors in Angular:
    @Injectable()
    export class GlobalErrorHandlerService implements ErrorHandler {
        handleError(error) {
            console.error('An error occurred:', error.message);
            console.error(error);
            alert(error);
        }    
    }

    App.module.ts:

     providers: [
        { 
            provide: ErrorHandler,
            useClass: GlobalErrorHandlerService
        },
    ],

    Best Practices in Handling Errors
        Now, we learned how to handle errors, here are a few things you should keep in mind while designing an Error Handler service.
        a. Use a try.. catch block to handle the known errors. Handle it accordingly. If you are not able to handle it, then re-throw it.
        b. Use a global error handler to trap all unhandled errors and show a notification to the user.
        c. The ErrorHandler does not trap HTTP Errors, You need to Use HTTP Interceptors to handle HTTP Errors. You can refer to this article 
        how to handle HTTP Errors in Angular.
    
    Catch error globally using HTTP Interceptor:
        @Injectable()
        export class GlobalHttpInterceptorService implements HttpInterceptor {
            //you can modify request as below
            request = request.clone({
                headers: request.headers.append(
                    "Accept-Language",
                    navigator.language
                ),
                withCredentials: true
            });

        intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            return next.handle(req).pipe(
                    catchError((response: HttpErrorResponse, event) => {
                        if (response instanceof HttpErrorResponse) {
                            if (response.status === 401) {
                                //lout user
                            }
                        }
                        return throwError(response);
                    })
                )
            }
        }
        
        in app.module.ts
         { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true  }
    
    Set Page Title Using Title Service:
        import { BrowserModule, Title } from '@angular/platform-browser';
        export class TitleComponent implements OnInit {
            constructor(private title:Title) { }
            ngOnInit() {
                this.title.setTitle("How to use title service in Angular")
            }
        }

    Meta service in Angular. Add/Update Meta Tags   
        import { Meta, MetaDefinition } from '@angular/platform-browser';
        constructor(private metaService:Meta){  }
        ngOnInit() {
            this.metaService.addTag( { name:'description',content:"Article Description"});
        }
    
    Lazy Load Images: 
        why? => With the images comes the issue of Page Load speed
        Lazy Loading Images is a technique, where we delay the loading of images until we need them. For Example, load only those images 
        which are above the fold. The images below the fold are loaded only when the user scrolls to that location. This helps to load the 
        page the quickly.    
        There are many third-party libraries available. One of the popular package is ng-lazyload-image.
    
    Life Cycle Hooks:
        ngOnChanges:  It is triggered every time when the Angular detected a change to the data-bound input property.does not fire when the 
                      input property is an array/object because Angular uses dirty checking to compare the properties.  
        
        ngOnInit: This hook is called after the constructor and first ngOnChanges hook is fired.
        ngDoCheck: This hook is called after every change detection cycle no matter where the change has occurred
        
        

Form:
    FormArray vs FormGroup:
         FormGroup: Finite number of form controls which we we already
         FormArray: InFinite number of form controls. Ex. Add skill button, each time you click add button new input box appears.
                    ex:
                        constructor(private fb:FormBuilder) {}
                        this.form = this.fb.group({
                            ... other form controls ...
                            lessons: this.fb.array([])
                        }); 
                        get lessons() {
                            return this.form.controls["lessons"] as FormArray;
                        }   
                        // Dynamically adding controls to a FormArray
                        addLesson() {
                            const lessonForm = this.fb.group({
                                title: ['', Validators.required],
                                level: ['beginner', Validators.required]
                            });
                            this.lessons.push(lessonForm);
                        }


   ==== Micro Front End ====
   
   It is technique where multiple SPA integrate together to achieve the desired goal. Benefits of MFE are
     a. Use of different framework for each app.
     b. Independent deployment.
     c. Development work on independently on their respective app.

   There are many ways we can achieve, one being famous is webpack's module federation.

   Concepts:
     Host: This is main app which displays remotes. You can call it as shell as well.
     Remote: This is the part of the app which displayed by host. This can framework agnostic. One host multiple remotes.
     MF Framework: This sits b/w host and remote for loading/unloading remote. Here we can use Webpack's module federation.
     
   For Angular projects, we have to use a builder package called @angular-architects/module-federation since webpack is internal to Angular CLI and its exposed. So, this package
   manages to communicates with webpack. It sit b/w app and webpack.
   
   One more thing is that MF can achieve through monorepo or multi-repo.
     Monorepo: Angular project contains a workspace which manages multiple apps. Basically, it will have single angular.json, package.json, node_modules folder.
     multi-repo: Two different apps are in two different repos which run independently. In our example, we will use multi-repo.
   
   Implementation:
     a. Create two different angular apps in two different folders.
     b. Add @angular-architects/module-federation package in both host and remote:
         ng add @angular-architects/module-federation --project host-app --port 4200 type host (for host app)
         ng add @angular-architects/module-federation --project remote-app --port 4201 type remote (for host app)
      
      These commands generates webpack.config.js file in respective folder. This config is only for module federation. Rest is handled through Angular CLI
    
    c. In host: modify webpack.config.js file:
        modify "remotes" property to all your remotes by pointing to their remoteEntry.js file.

        remotes: {
            "remote-app": "http://localhost:4201/remoteEntry.js"
        }
        
    d. In host: create a file called "declare.d.ts" file to exposed remote modules otherwise ts compiler shows error since it can't that module locally. 
       Add following content to file:
         declare module remote-app/*
    
    e. In host: Now, load that module through route.
        route = [
            {
                path: "user",
                loadChildren: () => import("remote-app/user").then(m => m.UserModule)
            }
        ]

    f. In remote-app: Create userModule, add component and route.
    g. In remote-app: Now, in webpack.config.js, expose the module:
        exposes: {
            "./user": "./src/app/user/user.module.ts",
        }
    h. Now, in host module navigate to /user.


    Instead of module we can use standalone component as well. Here is how:
        e: In host: Now, load that module through route.
            {
                path: "user-details",
                loadComponent: () => import("remote-app/user-details").then(m => m.UserDetailsComponent)
            }

        g:  In remote-app: Now, in webpack.config.js, expose the module:
            exposes: {
                "./user": "./src/app/user/user.module.ts",
                "./user-details": "./src/app/user/user-details/user-details.component.ts"
            }
        h. Now, in host module navigate to /user-details.
    
    
    Static shell vs Dynamic shell:
        static shell: What we did above is static shell. i.e In host, in webpack.config.js file, we have added remote entry.
        Dynamic Shell: In host, in webpack.config.js file, NO need to add remote entry. Instead, we can use loadRemoteModule() in routing. 
          Ex: 
                // STATIC SHELL

                {
                    path:"user",
                    loadChildren: () => import("remote-app/user").then(m => m.UserModule)
                },

                // THIS IS AN ALTERNATE APPROACH WHERE WE NO NEED TO CONFIG "remotes" IN WEBPACK.CONFIG. ITS DYNAMIC SHELL
                {
                    path: "user",
                    loadChildren: () => loadRemoteModule({
                    type: "module",
                    remoteEntry: "http://localhost:4201/remoteEntry.js",
                    exposedModule: "./user"
                    }).then(m => m.UserModule)
                },

                STANDALONE COMPONENT.

                // STATIC SHELL

                 {
                    path: "user-details",
                    loadComponent: () => import("remote-app/user-details").then(m => m.UserDetailsComponent)
                }

                // THIS IS AN ALTERNATE APPROACH WHERE WE NO NEED TO CONFIG "remotes" IN WEBPACK.CONFIG. ITS DYNAMIC SHELL

                {
                    path: "user-details",
                    loadComponent: () => 
                    loadRemoteModule({
                        type: "module",
                        remoteEntry: "http://localhost:4201/remoteEntry.js",
                        exposedModule: "./user-details"
                    }).then(c => c.UserDetailsComponent)
                }
    

    Communication between MFs:
      There are multiple ways you can communicate(send/receive data) among MFs.
        1. Event Driven: We can use CustomEvent as follow
            Remote:
                sendData() {
                    let customEventData = new CustomEvent("customEventData", {
                    detail: {
                        welcomeText: "hello there from remote app"
                    }
                    })
                    dispatchEvent(customEventData);
                }
            
            Host:
                ngOnInit(): void {
                    addEventListener("customEventData", (data) => {
                        this.welcomeText = (data as CustomEvent).detail.welcomeText;
                    })
                }   

        2. Shared libraries: This approach involves sharing common libraries(singleton) between micro-frontends, allowing them to access shared state and code. You can ngrx/store
            or create your own library and add it in "shared" webpack.config.js as singleton.
        3. REST APIs: This approach involves each micro-frontend exposing a REST API and communicating with other micro-frontends through HTTP requests.   
        4. Use local storage.      
    
        


Injecting a service without constructor:
ex:     
                import { inject } @angular/core;
                export class HomeComponent {
                    private serviceHome: ServiceHome =  inject(ServiceHome);
                }
        
View Encapsulation:
      a. Emulated(Default) : Adds random attributes to each element to make it as shadow DOM. When Angular relaesed a lot of browser didn't
          supported shadow dom. So Angular implmented it.
          What is shadow DOM: An important aspect of web components is encapsulation — being able to keep the markup structure, style, and behavior hidden and separate 
          from other code on the page so that different parts do not clash, and the code can be kept nice and clean
      n. Native: Implemenation of native shadow DOM. (Not recommeded not all browesr supports it)
      c. None: Styles wriiten in component can become global and can lead to ambuity.

      
Service Workers vs Web Workers:

Purpose: Service Workers are mainly used for network-related tasks and enabling progressive web app features, while Web Workers are used for offloading computation from the 
    main thread.
Browser Scope: Service Workers have a broader scope and can be shared across multiple pages, whereas Web Workers are scoped to a specific web page or tab.
Lifecycle: Service Workers have their own lifecycle and can remain active even when the web application is not open. Web Workers are tied to the lifecycle of the web page that 
    created them.
Communication: Both Service Workers and Web Workers communicate with the main thread using messaging, but Service Workers can interact with the DOM, while Web Workers cannot.  


Global Error Handle:
     => Instead of hanling error every handle it globally.
          for ex: this.http.get().subsribe((success)=> {}, (error)=> {toastMessAge() // No need to handle it here })
          steps:
              a. export class GlobalAppErrorHandler implemnts ErrorHandler {
                  handleError(error) {
                      //Show toast messahe
                  }
              }

              b. ngModule -> providers
                  {
                      provide: ErrorHandler,
                      useClass: GlobalAppErrorHandler
                  }


 - @Viewchild() can be access only in ngAfterViewInit(). Type of ViewCHild is ElementRef
 - @ContentChild()  - can be access only in ngAfterContentInit()
 - ViewContainerRef: A container(like <ng-container #listViewsContainer></ng-container>) where two or more views can be attached
      Creating Dynamic Component: (Without using routs, selector)
      a. Refer this in component:  @ViewChild('listViewsContainer', {read: ViewContainerRef}) listViewsContainer: ViewContainerRef;
      b. Invoke create Component-> const componentInstance = this.listViewsContainer.createComponent(DynamicComponent);
      c. Add input properties: componentInstance.setInput("helper", this.helper)    
      
      
 HostListner("click") method() {} to listen events in directive. We can achieve same thing using HostBinding. but always use HostListner.   
 
Structural directives are prefixed with an asterisk (*), and they often modify the DOM layout by adding or removing elements.
    Create Custom Structural Directive: (For example *ngIf)
          a. Create a directive([customNgIf])
          b. Add "@Input() customNgIf" to recieve data (Note here, @Input and selector both should match)
          c. Inject TemplateRef and ViewContainerRef
          d. In ngOnChanges() {
              if(inputDataTrue) viewContainerRef.createEmbeddedView(this.tempRef)
              else this.viewContainerRef.clear()
          }

    Create Custom Directive([HighlightOnHover]):
        @Directive({
            selector: "[HighlightOnHover]"
        })
        export class HighlightOnHover {

            @Input() HighlightOnHover: string = "red";

            constructor(private render: Renderer2, private el: ElementRef) { }

            ngOnChanges(changes: SimpleChanges) {
                this.render.setStyle(this.el.nativeElement, "background-color", this.HighlightOnHover);
            }

            @HostListener('mouseenter') onMoverOver() {
                this.render.setStyle(this.el.nativeElement, "background-color", "red");
            }

            @HostListener("mouseleave") onMouseLeave() {
                this.render.setStyle(this.el.nativeElement, "background-color", "blue");
            }
        }

        in host component:
            <div [HighlightOnHover]="highlightColor">Highligh text</div>

            setInterval(() => {
                this.highlightColor = this.highlightColor == "red" ? "blue": "red";
            }, 3000)


    custom structural directive  vs custom directive:
        - Custom directives add behavior or modify attributes, while custom structural directives change the DOM structure based on conditions.   
        - Custom directives are commonly used for things like styling or input validation, while custom structural directives are used for conditionally rendering or 
          structurally altering elements.     

    Resolving dynamic data with resolve guard: In Angular, you can use a route resolver guard to fetch dynamic data before activating a route. The resolver guard ensures that 
    the route is only activated when the required data is available, preventing the route from rendering until the data is resolved
         a. create a class
         @Injectable({
            providedIn: 'root'
         })
         export ProductResolver implements Resolve {
                constructor(private dataService: DataService) {}

                @override
                resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
                    return this.dataService.getProducts();
                }
         }
         b. add in route like: {path: componentDemo, resolve: { products: ProductResolver }}
         c. Retrieve the data in component like this -> this.route.data.subscribe(data => console.log(data["products"]))   
         
         
    Reacive ForGroup:
      this.form = new FormGroup({
          "email": new FormControl("", [Validators.required, Validators.email, this.customValidator], asyncValidateEmail) // asyncValidateEmail is a fnctinn where retrun async data
      })

      We can also nest it:
        this.form = new FormGroup({
            "LoginData":  new FormGroup({
                "email": new FormControl("", [Validators.required, Validators.email], asyncValidateEmail)
            })
        })  
        
    
    Custom Pipe:
          @Pipe({
              name: "customPipe",
              pure: false // by default true.  This can lead to performance issue
          )
          export class CustomPipe implments PipeTranform {
              tranform(value, args) {
                  return "tranformed Data"
              }
          }
          and in template
          {{data | customPipe:param1}}
    
    
          A pure pipe is only called when Angular detects a change in the value or the parameters passed to a pipe.
          An impure pipe is called for every change detection cycle no matter whether the value or parameter(s) changes.
    
          This is relevant for changes that are not detected by Angular
              a. when you pass an array or object that got the content changed (but is still the same instance)
              b. when the pipe injects a service to get access to other values, Angular doesn't recognize if they have changed.
    
          In case of impure pipe, use cache to improve performance  
          
          
   CanLoad Guard:
          WHy needed? its loads the lazy loaded modules even user doesn't have access to that route. To avoid we can implement CanLoad
          How to impl?
          class camLoadDemo implemnets CanLoad {
              canLoad(Route, Segments) { return true }
          }
          How to use:
          {
              path: ":objectName/list/:objectId",
              canLoad: [camLoadDemo],
              loadChildren: () =>
                  import("../feature/table/table.module").then(
                      (m) => m.CMSTableModule
                  )
          }  
          
   RouteReuseStrategy : In simple sentence it caches the components and prevent it from reload the components again and again.
     While in angular to navigate from one page to another page, we have an concept called Routing. By using this we can redirect from one page to another.
     so, when we navigate to another page it doesn’t store the previous page values. And when we come back to previous page it reload the whole page again.
     By this we end up with performance issue.
     for example in our project we have a search page where we load thousands of records or many more. so, it take bit long time to load the page.
     And we navigate from page to page then it reload again and again. At some point we thought that why the page is loading again and again .
     I don’t want to load the page, if it already loaded then get it from some cache memory and reuse it.
     For this scenario we will be using RouteReuseStrategy

     import { RouteReuseStrategy } from '@angular/router';

     export class CustomReuseStrategy implements RouteReuseStrategy {
         private routeCache = new Map<string, DetachedRouteHandle>();

        shouldDetach(route: ActivatedRouteSnapshot): boolean {
            // Determine whether to detach the route component
            return route.data.shouldDetach === true;
        }

        store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
            // Store the detached route component in the cache
            this.routeCache.set(route.routeConfig?.path || '', handle);
        }

        shouldAttach(route: ActivatedRouteSnapshot): boolean {
            // Determine whether to reattach the route component
            return this.routeCache.has(route.routeConfig?.path || '');
        }

        retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
            // Retrieve the detached route component from the cache
            return this.routeCache.get(route.routeConfig?.path || '') || null;
        }

        shouldReuseRoute(
            future: ActivatedRouteSnapshot,
            current: ActivatedRouteSnapshot
        ): boolean {
            // Determine whether to reuse the route component
            return future.routeConfig === current.routeConfig;
        }
     }

     @NgModule({ [...],
     providers: [
     {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
     ]
     )}     
     
     
     const routes: Routes = [
        {
            path: 'cached-route',
            component: CachedComponent,
            data: { shouldDetach: true }, // Indicate that this route should be cached
        },
        // Other routes...
    ];


    ===================WebPack============

    Webpack is a module bundler. It takes the modules from entryPoint and combines one or more modules into one or more bundles.

    What is a JavaScript module bundler?
        A bundler is a development tool that combines many JavaScript code files into a single one that is production-ready loadable in the browser. A fantastic feature of a bundler
        is that it generates a dependency graph as it traverses your first code files. This implies that beginning with the entry point you specified, the module bundler keeps track
        of both your source files’ dependencies and third-party dependencies.
    
    EntryPoint: An entry point indicates which module webpack should use to begin building.

        webpack.config.js:
        module.exports = {
            entry: './path/to/my/entry/file.js',
        };
    
    Output: 
        const path = require('path');

        module.exports = {
        entry: './path/to/my/entry/file.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'my-first-webpack.bundle.js',
        },
        };    
    
    Loaders:
        Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be 
        consumed by your application.

        Ex:
           module.exports = {
                output: {
                    filename: 'my-first-webpack.bundle.js',
                },
                module: {
                    rules: [
                        { 
                            test: /\.scss$/, 
                            use: [
                                'style-loader',
                                'scss-loader',
                                'css-loader'
                            ]
                        },
                        { test: /\.ts$/, use: 'ts-loader' },
                    ],
                },
            };
    
    Plugins:
        While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and 
        injection of environment variables. 

        module.exports = {
            module: {
                rules: [{ test: /\.txt$/, use: 'raw-loader' }],
            },
            plugins: [
                new HtmlWebpackPlugin({ template: './src/index.html' })
            ]
        };

        In the example above, the html-webpack-plugin generates an HTML file for your application and automatically injects all your generated bundles into this file.

                
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
        In this case, already created index.html uses and inject bundled js into this html file(This is helpful where in react project, requires a root element)

    Multiple Entry Points:
        If your configuration creates more than a single "chunk" (as with multiple entry points or when using plugins like CommonsChunkPlugin), you should use substitutions to ensure that 
        each file has a unique name.

        module.exports = {
            entry: {
                app: './src/app.js',
                search: './src/search.js',
            },
            output: {
                filename: '[name][contentHash].js', //hashing to generate unique file name for each build so that browser doesn't use cached file.
                path: __dirname + '/dist',
            },
        };

    What is a webpack Module?
        In contrast to Node.js modules, webpack modules can express their dependencies in a variety of ways. A few examples are:

        An ES2015 import statement
        A CommonJS require() statement
        An AMD define and require statement
        An @import statement inside of a css/sass/less file.
        An image url in a stylesheet url(...) or HTML <img src=...> file.    


    Module Resolution:
        A resolver is a library which helps in locating a module by its absolute path. A module can be required as a dependency from another module as:

        import foo from 'path/to/module';
        // or
        require('path/to/module');
        The dependency module can be from the application code or a third-party library. 
        Relative paths:
            import '../src/file1';
            import './file2';
            In this case, the directory of the source file where the import or require occurs is taken to be the context directory. 
                  
    Module Federation
        Multiple separate builds should form a single application. These separate builds act like containers and can expose and consume code between builds, creating a single, 
        unified application. This is often known as Micro-Frontends, but is not limited to that.  
    
    Dependency Graph:
        Starting from these entry points, webpack recursively builds a dependency graph that includes every module your application needs, then bundles all of those modules into 
        a small number of bundles - often, only one - to be loaded by the browser.  
    
    Why webpack?
        There are two ways to run JavaScript in a browser. 
        a. First, include a script for each functionality; this solution is hard to scale because loading too many scripts can cause a network bottleneck. 
        b. The second option is to use a big .js file containing all your project code, but this leads to problems in scope, size, readability and maintainability. 
        
        Following libs are require to get started with basic app by using webpack:
        "@babel/core": "^7.23.2",
        "babel-loader": "^9.1.3",
        "html-webpack-plugin": "^5.5.3",
        "webpack": "^5.89.0",
        "webpack-cli": "^5.1.4",
        "webpack-dev-server": "^4.15.1"
        Now create a webpack.config.js file, add all config and in package.json file add: "start": "webpack serve" and now run: "npm run start"


    Angular vs React which one you would use:
        1.  If there are 10 teams working on 10 different apps then I would recommend Angular since its code style and library's remains same for all the projects and we can swap
            the resources(developers) among the projects so there is no learning curve.
            However, react customized for every projects. That is 5 teams, working on 5 apps can have diffrent library and code style. So, one developer working one project and when
            he switch to another project it will be little difficult to understand. For ex. "routing" library can be used diffrently in each project but in case Angular it will always
            same. 
        2.  If app is going to small and staring early then use react. It will be very quick.






WebWorker usage in Angular:

        1. run "ng g web-worker app" which generates a app.worker.ts file in src/app folder
        2. it also generates tsconfig.worker.json file, which contains metadata of webworker files.
        3. Now use it as below to do heavy calculation of fibonanci as example:
            
            fib.compute.component.ts

                getFibonacci() {
                    let worker = new Worker(new URL('../app.worker.ts', import.meta.url) );
                    worker.postMessage(+this.num);
                    worker.onmessage = ((event) => {
                    console.log('res', event.data)
                        this.result = event.data; //assign to angular class variable
                    })
                }

            app.worker.ts   
            
            /// <reference lib="webworker" />

            addEventListener('message', ({ data }) => {
                const response = `worker response to ${data}`;
                let res = fibonacci(data)
                postMessage(res);
            });

            function fibonacci(num: number) {
                var num1 = 0;
                var num2 = 1;
                var sum;
                var i = 0;
                for (i = 0; i < num; i++) {
                    delayExecution()
                    sum = num1 + num2;
                    num1 = num2;
                    num2 = sum;
                }
                return num2;
            } 

            function delayExecution() {
                const startTime = Date.now();
                while (Date.now() - startTime < 100) {
                    // Do nothing, wait for 100 miliseconds
                }
                console.log("Execution complete after 100 miliseconds.");
            }







    
   How to debug an production Angular app?
   => We can debug production built Angular app by SourceMaps. Here are the steps.
    
        a. Enable Source: By default SourceMaps are disabled for production apps due to security reasons. To enable it, go to angular.json file and add "sourceMap": true as a json property 
           in "projects->architects->build->configuration".
        b. Now run -> "ng build" to generate build files in dist folder. It will generate .map files for corresponding .js files. (Please make sure that production and local code base should be same i.e same release branch)
            ex: main.5a71fbc6ce65b6da.js ==> main.5a71fbc6ce65b6da.js.map
        c. Now go to production site, open debugger tool and open .js where you want to put debugger. Now right click -> add source map and enter .map file which generated during ng build.
                ex: file:///D:\Work\CMS\cmsnfv\cms_service\WebGateway\src\webapp\dist\cms-ui\main.5a71fbc6ce65b6da.js.map   
        d. Now, try to put debug point in js, it will automatically navigate to .ts or .js file.      
        
    How to enhance performance for an web app:
        There three categories of improvement
            a. Programming level:
                i. CPU intensive tasks: Identify which function is taking more time to execute by profile it using chrome's performance dev tool. Main thread optimizing: Usually main 
                    thread all the task including parsing and executing html/css and executing JS. Optimizing JS execution: Its also CPU task. Usually we calculate using Big O notation.
                ii. Memory leaks: Identify the memory leaks by using taking snapshots using chromes dev tool.(Check below section for memory leaks in JS).
            b. Framework Level: This we already discussed about angular performance enhancement. Use Angular's browser plugin for profiling.
            c. Core Web vitals: Initial loading should be fast otherwise people will loose interest in webapp they are visiting otherwise you will start loosing money. 
                i. LCP(Largest contentful paint): It measures loading performance of the assets. Your app needs to load all resources like js/html/css/fonts/images/videos etc. First it loads FCP(First Contentful Paint)
                   like text/fonts etc then it gradually starts loading images/videos which are LCP. A good metric is that LCP should load within 2.5 secs.
                        How to identify/analyze LCP?
                            => Check in network tab which resource is taking long time.
                                - load images with reduced(Resize/optimize) size.
                                - Use CDN to load assets.
                                - use "fetchpriority" attribute in <img> tag as "low/high".
                                - Enable compression for all the resources(js,css, images etc) from server. For example in tomcat we can do by using - server.compression.enabled = true

                ii. FID(First Input delay): It measure user interactivity. Should be less than 100ms. For example, when user clicks on button, the time browser take to handle the event listener.
                        - Reduce JS execution time.
                iii.CLS(Cumulative Layout Shift): It measures visual stability. In another words, elements in page shouldn't be jumping around in unexpected way.
                        How to identify/analyze LCP?
                            => LightHouse tool or web vital chrome extension.
                                - Use images with width/height property.
                                - avoid changing width/height property of element after once rendered.
                                - stop showing ads. 
    


         


   === Memory Leaks in JavaScript===


    1. Unintentional Global Variables:

        Global variables can persist throughout the application's lifecycle. If you create variables without the var, let, or const keyword, they become global by default.
        To avoid this, always declare variables with var, let, or const in the appropriate scope.
        javascript
        Copy code
        // Potential memory leak
        function test () {
            myVar = "I'm a global variable";
        }

        // Corrected version
        function test () {
            var myVar = "I'm a local variable";
        }
        

    2. Circular references: can occur when objects reference each other, creating a closed loop that cannot be garbage collected.
        To prevent this, be cautious when setting object properties that reference other objects. Use weak references or remove references when they are no longer needed.
        javascript
        Copy code
        // Circular reference
        const objA = {};
        const objB = {};
        objA.ref = objB;
        objB.ref = objA;

        // Corrected version
        const objA = {};
        const objB = {};
        objA.ref = objB;
        delete objB.ref;

    3. Event Listeners:

        Event listeners can create memory leaks when they are not properly removed, preventing the associated objects from being garbage collected.
        Be sure to remove event listeners when the associated DOM elements are removed or when they are no longer needed.
        javascript
        Copy code
        const button = document.getElementById("myButton");

        // Potential memory leak
        button.addEventListener("click", myFunction);

        // Corrected version
        button.removeEventListener("click", myFunction);
    
    4. Timers and Intervals:

        Timers and intervals set using setTimeout or setInterval can cause memory leaks if they are not cleared when no longer needed.
        Always clear timers and intervals using clearTimeout or clearInterval when they are no longer required.
        javascript
        Copy code
        // Potential memory leak
        const timer = setTimeout(() => {
        // Some code
        }, 1000);

        // Corrected version
        clearTimeout(timer);

    5. DOM References:

        Holding references to DOM elements that are removed from the DOM can lead to memory leaks.
        Remove or dereference elements that are no longer in use or have been removed from the DOM.
        javascript
        Copy code
        const element = document.getElementById("myElement");

        // Potential memory leak if element is removed from the DOM
        // Remove or reassign the reference when it's no longer needed.

    6. Closures and Scopes:

        Closures can cause unintentional memory leaks if they capture references to variables that are no longer needed.
        Be mindful of variable scope and use closures judiciously.
        javascript
        Copy code
        function createClosure() {
        const data = "Sensitive data";
        return function() {
            // The closure captures 'data', preventing it from being garbage collected.
            return data;
        };
        }

        // In this case, the closure holds a reference to 'data'.
        // Avoid capturing unnecessary data in closures.
        const leakyClosure = createClosure();

    7.  Memory-Intensive Operations:

        Certain operations, such as working with large data structures or processing many items in a loop, can consume excessive memory.
        Use proper memory management techniques, like breaking up large tasks into smaller chunks or using streaming approaches to minimize memory usage.         

            



    ==========Concurrency vs Parallelism=====
    Concurrency: Utilizes only one thread of an CPU, however, uses callback mechanism to executes task(single thread, non blocking).
    Parallelism: Utilizes multiple threads of the CPU. Ideal for CPU intensive tasks. Ex. Looping through large array for processing or image processing. Just because you are using multi threaded
    doesn't mean that it will be faster. It depends on I/O operations. Threads are like sequence of instructions to CPU which manages by OS scheduler. A rule of thumb is you should not have more threads than you number 
    of cores. In Java, a pool manages the threads, so you can create many threads at a time.

    Ideally, n workers = n cores.



    lazy initialization means -  that create an instance of an object only if doesn't exist OR fetch the data only if it is not already fetched.


    structuredClone() global function:
        The global structuredClone() method creates a deep clone of a given value using the "structured clone algorithm".
        ex: const original = { name: "MDN" };
            original.itself = original;

            // Clone it
            const clone = structuredClone(original);

    
    Broadcast Channel API:
        The Broadcast Channel API allows basic communication between browsing contexts (that is, windows, tabs, frames, or iframes) and workers on the same origin.
        By creating a BroadcastChannel object, you can receive any messages that are posted to it. You don't have to maintain a reference to the frames or workers you wish to communicate with: 
        they can "subscribe" to a particular channel by constructing their own BroadcastChannel with the same name, and have bi-directional communication between all of them.
            a. Creating or joining a channel:
                    // Connection to a broadcast channel
                    const bc = new BroadcastChannel("test_channel");
            b. Sending a message:
                    // Example of sending of a very simple message
                    bc.postMessage("This is a test message.");

                Data sent to the channel is serialized using the structured clone algorithm. That means you can send a broad variety of data objects safely without having to serialize them yourself.            
            c. Receiving a message:
                // A handler that only logs the event to the console:
                bc.onmessage = (event) => {
                    console.log(event);
                };
            d: Disconnecting a channel:
                // Disconnect the channel
                bc.close();    
    
    
    Sort:
        sort() method expects a 'comparator' function as argument. This comparator should return  
            a. " > 0"	sort a after b, e.g. [b, a], (Ascending order)
            b. "< 0"	sort a before b, e.g. [a, b] (Descending order)
            c. === 0	keep original order of a and b

            examples:
                Numbers:
                    //sort Ascending
                    const data = [2,1,8,4];
                    data.sort((a, b) => a - b) 
                    console.log(data) // 1,2,4,8

                    //sort Descending
                    const data = [2,1,8,4];
                    data.sort((a, b) => b - a) 
                    console.log(data) // 8,4,2,1
                
                String:
                    //sort Ascending
                    const data = ["b", "g", "A", "t", "a"];
                    data.sort((a, b) => a.localeCompare(b)) 
                    console.log(data) // A, a, b, , g, t
                    
                Objects:

                    const data = [
                        {name: "Viv", age: 40},
                        {name: "Arvik", age: 10},
                        {name: "Arch", age: 38},
                    ]

                    //Sort by name
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    
                    //Sort by age
                    data.sort((a, b) => a.age - b.age);



        
        
        Note: To sort the elements in an array without mutating the original array, use toSorted().

    How Angular bootstraps or how Angular app loads/starts?
=> There are two phases of Angular loads, 
        1. Compile time:
            a. Angular cli makes use of webpack as module bundler internally.
            a. angular.json file is webpack's configuration file. Angular cli make use of this config file to build Angular app.
            b. When you run ng server or ng build, the entry point of "main.ts" is configured in angular.json file.
            c. in main.ts file, it bootstraps and root module.
                platformBrowserDynamic().bootstrapModule(AppModule).then().catch()
            d. The root module (AppModule) contains the bootstrap component(its AppComponent) and so on.
            e. based on above configuration webpack creates main.[hash].js(basically Angular core + Router + app code etc..), runtime.[hash] (basically webpack),js and pollyfill.js files and injects them into the index.html.
        2. RunTime:
           a. When you hit URL in browser, the server serves the index.html file first.
           b. The injected main.js, runtime.js etc. loads the script.
           c. The webpack stores the all the modules like angular core, router in global variable.
           d. Angular(vendor.js angular functions) looks for "root-selector" index.html, it acts as a container so that whether to inject angular app as starting point.

angular.json file:
==> 
    "projects": {
    "projectName": {
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/projectName",
            "index": "src/index.html",
            "main": "src/main.ts",
            "aot": true,
            "buildOptimizer": true
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": [] // to load external js files. However, its not good idea if file is large. Better create an angular service and load it from there. Example given below
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "dymmy_angular:build:production"
            },
            "development": {
              "browserTarget": "dymmy_angular:build:development"
            }
          },
          "defaultConfiguration": "development",
          "options": {
            "proxyConfig": "proxy.config.json" //Important for developement
          }
        },

    Load External script files after app loads or after login based on requirement.

    in Angular.json file:
     {
        ...,
        scripts: [
            {
                bundleName: "script1",
                inject: false,
                input: "{filepath}"
            }
        ],
        ...
     }
        @Injectable()
        export class ExternalScriptService {
            EXTERNAL_SCRIPTS = [
                "script1.js",
                "script2.js"
            ]

            constructor() { }

            init() { // call this method after login or app loads or lazy load module based on requirement.
                for (let val of EXTERNAL_SCRIPTS)
                    this.loadExternalScript(val);
            }

            loadExternalScript(url: string) {
                const body = <HTMLDivElement>document.body;
                const script = document.createElement('script');
                script.innerHTML = '';
                script.src = url;
                script.async = false;
                script.defer = true;
                body.appendChild(script);
            }
        }

    Angular - Difference between "optimization" and "buildOptimizer" in the build config (angular.json)
   => buildOptimizer optimizes the transpilation of TS to JS (remove unused code, add tslib,..)
      optimization:
        a. Use code-splitting for bundle size reduce:
                # webpack.config.js
                optimization: {
                    splitChunks: {
                        // include all types of chunks
                        chunks: 'all',
                    }
                }


        
    What is the difference between "@angular-devkit/build-angular:browser" and "@angular-devkit/build-angular:dev-server"
    => 
    Browser:
        As in the source code of the browser builder, this builder uses the webpack package bundler to create a minified and agulified angular app for production. 
        Webpack bundles the application modules and all their dependencies and put them in separat files in the specified dist folder. It also does extra work based on the configuration 
        like tree shaking etc.
        You should use this builder when you want to bundle minfiy (deploy) your angular application for production/staging or other deployment phases.

    Dev-Server:
        As mentioned in angular deployment guide angular uses webpack to build and serve the application using a node server with a specified port to create an angular app with mapped ts 
        files for easier debugging. It also provides live reload on change. The application code will be compiled and the app files will be copied to the heap memory and opens.

Ahead-of-time (AOT) compilation:
    The Angular ahead-of-time (AOT) compiler converts your Angular HTML and TypeScript code into efficient JavaScript code during the build phase before the browser downloads and runs that code. 
    Compiling your application during the build process provides a faster rendering in the browser.

Choosing a compiler
Angular offers two ways to compile your application:
ANGULAR COMPILE	DETAILS
    Just-in-Time (JIT)	Compiles your application in the browser at runtime. This was the default until Angular 8.
    Ahead-of-Time (AOT)	Compiles your application and libraries at build time. This is the default starting in Angular 9.
    When you run the ng build (build only) or ng serve (build and serve locally) CLI commands, the type of compilation (JIT or AOT) depends on the value of the aot property in your build 
    configuration specified in angular.json. By default, aot is set to true for new CLI applications.    


    If bundle size is huge, then how would you optiomize:
        a.  Use code-splitting for bundle size reduce:
                # webpack.config.js
                optimization: {
                    splitChunks: {
                        // include all types of chunks
                        chunks: 'all',
                    }
                }  
        b. Do not include source maps:
            configurations": {
                "production": { 
                    ...  
                    "sourceMap": false,
                    ...
                },
                "development": {
                    "sourceMap": true,
                }                            
        c.Tree shaking
        d. Minification
        d. Compression: Used mostly by servers to compress the assets before serving them over to the network. Gzip is accepted by all browsers nowadays.
                ex: express server:
                    // add compression middleware
                    app.use(compression());

    JS engine which inbuilt language uses:
    ==> Chrome's Javascript engine, V8, is written in C++

    who pushes callback into the callstack:
    ==> In JavaScript, the Event Loop pushes callbacks into the call stack when the call stack is empty. The Event Loop monitors the call stack and task queue continuously. 
    When a timer expires, the callback function is put in the Callback Queue. When the method registers a callback function, the Event Loop ensures it's added to the call stack 
    for execution when the stack is empty. 

    How garbage collection works in javascript?
    ==> The garbage collector works by traversing the object graph and marking objects that are reachable. Unreachable objects are then removed in the next step.
        The object graph is a graph of all the objects in the program. Each object in the graph is connected to the objects that it references. The garbage collector starts at the root objects,
        which are the objects that are global or that are referenced by global objects. The garbage collector then traverses the object graph, marking all the objects that it reaches.
        Once the garbage collector has marked all the reachable objects, it removes all the unreachable objects. Unreachable objects are objects that are not referenced by any other object 
        in the program. The garbage collector runs automatically, so the programmer does not need to explicitly call it. The garbage collector will run when it detects that there is memory 
        that can be reclaimed.

        When garbage collector runs?
        => The garbage collector uses a technique called the "mark-and-sweep" algorithm to identify and remove objects that are no longer in use. The mark-and-sweep algorithm works 
           by first marking all objects that are reachable from the global object. The global object is a special object that is always reachable. 
           Once all reachable objects have been marked, the garbage collector sweeps through the memory and removes all objects that are not marked.
         
           The garbage collector runs automatically, but there are a few things that you can do to help it run more efficiently:
                Avoid creating unnecessary objects.
                Avoid holding on to objects that you no longer need.
                Use a memory profiler to identify and fix memory leaks.

            Here are some specific examples of when the garbage collector might run:
                When a function returns, the garbage collector will collect any objects that were created inside the function and are no longer in use.
                When an object is assigned to a new variable, the garbage collector will collect the old object if it is no longer in use.
                When an object is removed from an array, the garbage collector will collect the object if it is no longer in use.



    How DOM gets loaded into the browser?
    => 
        HTML Parsing:
        When you enter a URL in your browser, the browser makes a request to the server, which responds with an HTML document.

        Tokenizing involves breaking down the HTML code into individual tokens.
        Lexing, short for lexical analysis, is the process of converting these tokens into objects with properties and methods.
        
        DOM Tree Construction:
        The browser constructs the Document Object Model (DOM) tree,
        Each HTML element becomes a node in the DOM tree, with parent-child relationships based on the HTML structure.
        
        Object Creation:
        As the HTML elements are parsed and processed, corresponding objects, or nodes, are created in memory.
        These nodes have properties and methods that allow developers to interact with and manipulate the document through JavaScript.
        
        Script Execution:
        The browser encounters and executes script tags during the parsing process.
        
        CSSOM Construction:
        While constructing the DOM, the browser also parses and interprets CSS stylesheets.

        Render Tree Construction:
        The browser combines the DOM and CSSOM to create the render tree.
        The render tree is a subset of the DOM that includes only the nodes required for rendering the visible content on the page, considering styles and layout information.
        
        Layout:
        Layout, also known as reflow, involves calculating the position and size of each element on the page.
        The browser determines the dimensions and positioning based on the styles, content, and the structure of the render tree.
        
        Painting:
        Painting is the process of rendering the pixels on the screen based on the calculated layout.
        It involves drawing the visual content onto the visible area of the browser window.
        
        DOMContentLoaded Event:
        The DOMContentLoaded eent is fired when the initial HTML document is fully parsed, and the DOM is constructed.
        
        Load Event: Fires once everything loaded.


    When not to use arrow functions?
    => Arrow functions in JavaScript offer a concise syntax and lexical scoping, making them a powerful and convenient feature in many situations. However, 
    there are specific scenarios where using arrow functions may not be the best choice:   
    
    Object Methods:
        When defining methods inside an object, arrow functions are not suitable because they do not have their own this context. The this value in an arrow function is inherited 
        from the enclosing scope, which can lead to unexpected behavior.
        const obj = {
            // Avoid using arrow function for object methods
            method: () => {
                // 'this' in this context does not refer to 'obj', it refers to window object or its lexical scope depends on context
            }
        };

    Constructor Functions:
        Arrow functions cannot be used as constructor functions to create instances of objects. They lack the new.target binding, and using them with new can lead to errors.
        // Avoid using arrow function as constructor
        const Example = () => {
            // 'this' in this context is not what you expect
        };
        const instance = new Example(); // Error
        
    Event Handlers:
        Arrow functions might not be the best choice for event handlers, especially when the this context needs to refer to the element triggering the event.
        const button = document.getElementById('myButton');
        // Avoid using arrow function for event handlers
        button.addEventListener('click', () => {
            // 'this' in this context does not refer to 'button'
        });
    
    Methods in Classes:
        When defining methods in ES6 classes, it's generally better to use regular function syntax. Class methods should have their own this context, which arrow functions don't provide.
        class MyClass {
            // Avoid using arrow function for class methods
            method() {
                // 'this' in this context refers to the instance of MyClass
            }
        }


    
        


           





         


            

    




    
        


           




         

**/

