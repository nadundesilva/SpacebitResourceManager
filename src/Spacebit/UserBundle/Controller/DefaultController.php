<?php

namespace Spacebit\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitUserBundle:Default:home.html.twig');
    }

    public function loginAction()
    {
        return $this->render('SpacebitUserBundle:Default:login.html.twig');
    }

    public function signupAction()
    {
        return $this->render('SpacebitUserBundle:Default:signup.html.twig');
    }
    public function signinprocess()
    {
        return $this->render('SpacebitUserBundle:Default:sign_in_process.php');
    }
}
