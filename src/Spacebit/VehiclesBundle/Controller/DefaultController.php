<?php

namespace Spacebit\VehiclesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function vehiclesAction()
    {
        return $this->render('SpacebitVehiclesBundle:Default:vehicles.html.twig');
    }
}
