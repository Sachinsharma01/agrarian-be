import { Joi } from "celebrate";

export default {
    getPosts: Joi.object().keys({
        crop: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        
    })
}