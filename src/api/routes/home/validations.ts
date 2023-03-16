import { Joi } from 'celebrate';

export default {
    weather: Joi.object().keys({
        lat: Joi.number().required(),
        long: Joi.number().required(),
    })
}