export default {
  clientId: process.env.NEXT_PUBLIC_W3AUTH_CLIENTID,
  chainConfig: {
    chainNamespace: process.env.NEXT_PUBLIC_W3AUTH_CHAIN_NAMESPACE,
    chainId: process.env.NEXT_PUBLIC_W3AUTH_CHAIN_ID,
    rpcTarget: process.env.NEXT_PUBLIC_W3AUTH_RPC_TARGET,
  },
  web3AuthNetwork: process.env.NEXT_PUBLIC_W3AUTH_NETWORK,
  verifier: process.env.NEXT_PUBLIC_W3AUTH_VERIFIER,
  subVerifier: process.env.NEXT_PUBLIC_W3AUTH_SUB_VERIFIER_WEB,
};
