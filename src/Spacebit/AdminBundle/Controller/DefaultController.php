<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitAdminBundle:Default:home.html.twig');
    }

    public function sampleAction()
    {
        return $this->render('SpacebitAdminBundle:Default:sample.html.twig');
    }
}
