import { Context, ContextParameters } from 'graphql-yoga/dist/types';
import { Photon } from '@generated/photon';
import { photon } from './photon';

export type Context = {
    photon: Photon;
    ctxParams: ContextParameters;
};

export const createContext = (ctxParams: ContextParameters): Context => ({
    photon,
    ctxParams,
});
