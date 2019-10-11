import { Context, ContextParameters } from 'graphql-yoga/dist/types';
import { PubSub } from 'graphql-yoga';
import { Photon } from '@generated/photon';
import { photon } from './photon';
import { pubsub } from './pubsub';

export type Context = {
    photon: Photon;
    pubsub: PubSub;
    ctxParams: ContextParameters;
};

export const createContext = (ctxParams: ContextParameters): Context => ({
    photon,
    pubsub,
    ctxParams,
});
