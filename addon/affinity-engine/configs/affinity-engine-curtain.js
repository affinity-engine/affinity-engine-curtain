export default {
  priority: 1,
  'affinity-engine': {
    preloader: {
      preTransitionOutPauseDuration: 750,
      path: 'service:affinity-engine/curtain'
    },
    'sound-manager': {
      path: 'service:affinity-engine/curtain/sound-manager'
    }
  }
};
