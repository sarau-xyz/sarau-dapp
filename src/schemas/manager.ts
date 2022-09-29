import * as yup from 'yup';

export type CreateSarauForm = yup.InferType<typeof createSarauSchema> ;

export const createSarauSchema = yup.object({
    name: yup.string().required(),
    symbol: yup.string().uppercase().required(),
    maxMint: yup.string().required(),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    homepage: yup.string().url().required()
}).required();