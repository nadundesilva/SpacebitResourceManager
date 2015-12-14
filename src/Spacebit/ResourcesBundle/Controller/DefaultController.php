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
        $name = 'Achini';
        $age = 43;
        return $this->render('SpacebitResourcesBundle:Default:equipment.html.twig', array(
            'myName'=>$name,
            'myAge'=>$age,
        ));
    }

    public function locationsAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:locations.html.twig');
    }
}
