export default {
  priority: 2,
  component: {
    curtain: {
      preTransitionOutPauseDuration: 750
    }
  },
  'affinity-engine': {
    preloader: {
      path: 'service:affinity-engine/curtain'
    },
    'sound-manager': {
      path: 'service:affinity-engine/curtain/sound-manager'
    }
  }
};
