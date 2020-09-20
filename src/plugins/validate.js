import {extend} from "vee-validate"
import {
    required,
    alpha,
    email,
    confirmed,
    min,
    max,
    length,
    required_if,
    numeric,
    digits,
    image
} from "vee-validate/dist/rules";
import date_compare from './date_compare';
import time_compare from './time_compare';

export default function ( { app: { $guestRepository } } ) {

    extend("required", {
        ...required,
        message: "The {_field_} field is required"
    });

    extend("required_if", {
        ...required_if,
        message: "The {_field_} is required"
    });

    extend("alpha", {
        ...alpha,
        message: "The {_field_} must only contain alphabetic characters"
    });

    extend("email", {
        ...email,
        message: "The {_field_} must be valid email address."
    });

    extend("confirmed", {
        ...confirmed,
        message: `The {_field_} field confirmation does not match.`
    });

    extend("tcAccepted", {
        validate: value => !!value,
        message: "Please read our terms and condition and accept it!"
    });

    extend("min", {
        ...min,
        message: (field, params, data) => `The ${field} should be at least ${params.length} character.`
    });

    extend("max", {
        ...max,
        message: (field, params, data) => `The ${field} should be ${params.length} character at max.`
    });

    extend("checkUserName", {
        validate: (value,params) => {
            return new Promise(resolve => {
                $guestRepository.checkUserName({userName: value,userId:params[0]||undefined})
                    .then(({data}) => resolve({
                        valid: true,
                        data: undefined
                    }))
                    .catch(({response}) =>{
                        const { message } = response.data;
                        resolve({
                            valid: false,
                            data: message || undefined
                        })
                    })
            })
        },
        message: (field, params, data) => (data && data.message) || `The ${field} already exists with baxta.`
    });

    extend("checkEmail", {
        validate: (value,params) => {
            return new Promise(resolve => {
                $guestRepository.checkEmail({email: value,userId:params.userId||undefined})
                    .then(({data}) => resolve({
                        valid: true,
                        data: undefined
                    }))
                    .catch(({response}) =>{
                        const { message } = response.data;
                        resolve({
                            valid: false,
                            data: message || undefined
                        })
                    })
            })
        },
        message: (field, params, data) => (data && data.message) || `The ${field} already exists with baxta.`
    });

    extend("website", {
        validate: (value) => {
            const rule = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            return rule.test(value);
        },
        message: `This {_field_} field must be a valid website.`
    });

    extend("length", {
        ...length,
        message: (field, params, data) => `The ${field} should be ${params.length} character.`
    });

    extend("numeric", {
        ...numeric,
        message: (field, params, data) => `The ${field} must be numeric.`
    });

    extend("digits", {
        ...digits,
        message: (field, params, data) => `The ${field} must be numeric digits.`
    });

    extend("budget", {
        validate: (value) => {
            return !isNaN(value) && (value>0 && value<=1000000)
        },
        message: (field, params, data) => `The ${field} must be between 0 and 1000000.`
    });


    /*extend("before", {
      validate: (value, params ) => {
        console.log('before validate', value, params.targetField )
        return false
      },
      params: ['targetField'],
      message: "The {_field_} must be smaller than {targetField}."
    });

    extend("after", {
      validate: (value, targetDate, params) => {
        return false
      },
      params: ['targetField'],
      message: "The {_field_} must be smaller than {targetField}."
    });*/

    extend('is_earlier', {
        validate: (value, { compare }) => {
            return date_compare({value, compare, validationType: 'earlier'});
        },
        params: ['compare', 'dateType'],
        message: 'The {_field_} must not be earlier than {compare}.'
    });

    extend('is_beyond', {
        validate: (value, { compare }) => {
            return date_compare({value, compare, validationType: 'beyond'});
        },
        params: ['compare', 'dateType'],
        message: 'The {_field_} must not be older than {compare}.'
    });

    extend("min_date", {
        validate: (value, { min_value }) => {
            min_value = new Date(min_value)
            return value > min_value
        },
        params:['min_value'],
        message: `The {_field_} should be greater than {min_value}.`
    });



    extend('is_earlier_time', {
        validate: (value, { compare }) => {
            return time_compare({value, compare, validationType: 'earlier'});
        },
        params: ['compare', 'dateType'],
        message: 'The {_field_} must not be earlier than {compare}.'
    });

    extend('is_beyond_time', {
        validate: (value, { compare }) => {
            return time_compare({value, compare, validationType: 'beyond'});
        },
        params: ['compare', 'dateType'],
        message: 'The {_field_} must not be older than {compare}.'
    });

    extend("min_time", {
        validate: (value, { min_value }) => {
            min_value = new Date(min_value)
            return value > min_value
        },
        params:['min_value'],
        message: `The {_field_} should be greater than {min_value}.`
    });

    extend( 'contact_validation',{
        validate: function (value, { isValid, regionCode }) {
            return (true,"true").includes(isValid)
        },
        params:['isValid', 'regionCode'],
        message: `The {_field_} must be number of region {regionCode}.`
    });

    extend( 'address_validation',{
        validate: function (value, { address, place }) {
            if (typeof place == 'object' && place !== null) {
                return true;
            }
        },
        params:['address', 'place'],
        message: `Invalid location. Select valid location.`
    });

    extend("image", {
        ...image,
        message: "The {_field_} field must only be a valid image."
    });


    extend("required_if_multiple", {
        validate: (value, { dependencies }) => {
            let params = JSON.parse(dependencies);
            for( let key of Object.keys(params) ){
                if( ![null,undefined,''].includes(params[key].value) ){
                    return ![null,undefined,''].includes(value)
                }
            }
            return true;
        },
        params:[ 'dependencies' ],
        computesRequired:true,
        message: (field, { dependencies }) => {
            let params = JSON.parse(dependencies);
            for( let key of Object.keys(params) ){
                let {label, value } = params[key]||{};
                if( ![null,undefined,''].includes(value) ){
                    return `The ${field} is required when ${label} is added or you can remove ${label}.`
                }
            }
            return `The ${field} is required.`;
        }
    });

    extend('atLeastOneRequired', {
        validate: (value, { target }) => ['false',false].includes(target) ? !!value : true,
        params: ['target']
    });

    extend("image", {
        ...image,
        message: (field, params, data) => `The ${field} must only be of type image.`
    });

    extend("sameProportion", {
        validate: (files) => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onerror = () => resolve({valid: false});
                image.onload = function () {
                    resolve({valid: this.width === this.height});
                }
                image.src = URL.createObjectURL(files);
            })
        },
        message: (field, params, data) => `The ${field} must be of same proportion.`
    });
    extend('atLeastOneRequired', {
        validate: (value, { target }) => ['false',false].includes(target) ? !!value : true,
        params: ['target']
    });

}
