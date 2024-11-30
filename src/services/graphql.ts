import { gql } from 'graphql-request';

export const POOLS_QUERY = gql`
  query GetPools($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { totalValueLockedUSD_gt: "0" }
    ) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      feeTier
      totalValueLockedUSD
      volumeUSD
      token0Price
      token1Price
    }
  }
`;

export const USER_POSITIONS_QUERY = gql`
  query GetUserPositions($user: Bytes!) {
    positions(
      where: { 
        owner: $user,
        depositedToken0_gt: "0",
        depositedToken1_gt: "0"
      }
    ) {
      id
      owner
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
      pool {
        id
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
        feeTier
        totalValueLockedUSD
        volumeUSD
        token0Price
        token1Price
      }
    }
  }
`;

export const POOL_QUERY = gql`
  query GetPool($id: ID!) {
    pool(id: $id) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      feeTier
      totalValueLockedUSD
      volumeUSD
      token0Price
      token1Price
    }
  }
`;

export const POSITION_QUERY = gql`
  query GetPosition($positionId: ID!) {
    position(id: $positionId) {
      id
      owner
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
      pool {
        id
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
        feeTier
        totalValueLockedUSD
        volumeUSD
        token0Price
        token1Price
      }
    }
  }
`;