# bootstrap form groups

bootstrap form groups is a directive wrapper for bootstrap forms.

## installation

bower install --save ngb-bootstrap-forms
 
## quick start

syntax:  

    <input 
        form-control 
        fc-form-control-type="formControlType"   
        fc-type="type"  
        fc-control-placeholder="'This is a placeholder for: '+type"

        ng-repeat="type in inputTypes"  
        fc-control-l-ng-model="modelValue" 
        fc-control-ng-true-value="YES"
        fc-control-ng-false-value="NO" 
        fc-control-value="type">

##form control: `form-control`

a generic way to build form controls dynamically and can be driven by scope variables. generates form controls from the
type specified. the directive is attribute-only and replaces the original element it was used on. scope is inherited from parent

* directly used attributes:
    * **fc-form-control-type** specifies the name of the element type to use. possible values are
        1. input: `<input>`
        2. textarea: `<textarea></textarea>`
        3. select: `<select><option>...</select>`
    * **fc-type** is a special attribute for the `inputControl` directive that's used behind the scenes and binds the 
    scope value to the generated `<input>` control's type attribute. Supported values are 
        1. text
        1. password
        1. datetime
        1. datetime-local
        1. date
        1. month
        1. time
        1. week
        1. number
        1. email
        1. url
        1. search
        1. tel
        1. color
        1.  radio
        1.  checkbox
        1.  inlineRadio
        1.  inlineCheckbox
    * radio, checkbox, inlineRadio, and inlineCheckbox will use `fc-control-placeholder` as its label if specified.
* parameters with `fc-control` prefix is passed to the underlying form control
    * pass parameters values as it would be evaluated by Angular
    * `fc-control-*` the * will be passed as an attribute to the generated element. parameters are considered scope 
        values. enclose values in quotes to pass string value literals
    * `fc-control-l-*` the * will be passed as an attribute to the generated element. use this to pass angular directives 
        to the generated element. parameters are treated as _literal_ parameters by the directive and will be passed to the 
        generated element as-is. this prevents the expression from being evaluated by the `fc-control` directive before 
        the underlying directive has a chance to evaluate.


# underlying form controls

## input form control
## textarea form control
## select form control


# to come

## form control group

builds an html element with bootstrap's form-group structure and an accompanying form-control. will support 

* custom parameters drive inner html look and values
    * fg-class : additional css class binding aside from form-group
    * fg-label-class : custom class binding to apply to the form group's label (e.g. col-sm-xx)
    * fg-control-wrapper-class : custom class binding to apply to the control's div wrapper (e.g. col-sm-xx)
    * other features: *help-text*, validation

## popover/inline editor
