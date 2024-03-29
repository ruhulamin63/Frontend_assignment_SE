import {useAuthStore} from "~/stores/auth";
import {defineNuxtRouteMiddleware, navigateTo} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore();
    const guest_path = ['/login', '/forgot-password', '/reset-password'];
    const all_access_path = ['/privacy-policy'];

    if(!all_access_path.includes(to.path)){
        if(guest_path.includes(to.path) && auth.isAuthenticated){
            return navigateTo('/');
        }else if(!auth.isAuthenticated && !guest_path.includes(to.path)){
            return navigateTo('/login');
        }
    }

})