import * as yup from 'yup';

export const createSarau = yup.object({
    name: yup.string(),
    symbol: yup.string(),
    maxMint: yup.string(),
    startDate: yup.number().integer(),
    endDate: yup.number().integer(),
    homepage: yup.string().url()
});