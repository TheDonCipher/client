export const paywallConfig: Record<string, unknown> = {
  icon: '',
  locks: {
    '0xf140b1eb1ab1589a5bed987190656aba77a51b17': {
      network: 80001,
      skipRecipient: true,
    },
  },
  title: 'FundForward Membership',
  pessimistic: true,
  skipRecipient: true,
};
