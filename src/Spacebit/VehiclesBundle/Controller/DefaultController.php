<?php

namespace Spacebit\VehiclesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function vehiclesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT DISTINCT type AS name FROM vehicle;');
        $stmt->execute();
        $vehicle_categories = $stmt->fetchAll();

        return $this->render('SpacebitVehiclesBundle:Default:vehicles.html.twig', array(
            'vehicles_categories'=>$vehicle_categories,
        ));
    }

    public function getVehiclesByCategoryAction()
    {
        $request = Request::createFromGlobals();
        $category = $request->query->get('category');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type = :category;');
        $stmt->bindValue(':category', $category);
        $stmt->execute();
        $resiil = $stmt->fetchAll();

        $response = new Response(json_encode(array('rows' => $rows)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
