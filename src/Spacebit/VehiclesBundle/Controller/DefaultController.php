<?php

namespace Spacebit\VehiclesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function vehiclesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle;');
        $vehicles = $stmt->execute();
        return $this->render('SpacebitVehiclesBundle:Default:vehicles.html.twig', array(
            'vehicles'=>$vehicles,
        ));
    }
}
