
export const environment = {

    //**** PRODUCTION ****
    getEnvironment: 'https://finddrb.me/api/provider',
    
    //**** DEVELOPMENT ****
    //getEnvironment: '',
    
  };

  export const services = {
    login: '/login',
    logout: '/logout',
    forgotPassword: '/forgot/password',
    resetPassword: '/reset/password',
    upcoming: '/requests/upcoming',
    upcomingDetails: '/requests/upcoming/details',
    recent: '/requests/history',
    recentDetails: '/requests/history/details',
    complaints:'/complaints',
    sendRequest:'/trip/'

  };
