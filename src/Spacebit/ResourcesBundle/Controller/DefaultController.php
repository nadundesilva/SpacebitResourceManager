<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:home.html.twig');
    }

    public function equipmentAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:equipment.html.twig');
    }

    public function locationsAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:locations.html.twig');
    }
}
