import Registration from '@/views/auth/Registration.vue'
import Signin from '@/views/auth/Signin.vue'
import LoginWithLink from '@/views/auth/LoginWithLink.vue'
const router =[
    {
        name: 'login',
        path: '/login',
        component: Signin

    },
    {
        name: 'login_with_link',
        path: '/login-user',
        component: LoginWithLink

    },
    {
        name: 'registration',
        path: '/registration',
        component: Registration
    }
]
export default router
