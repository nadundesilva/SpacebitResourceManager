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
        $category = $request->request->get('category');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type = :category;');
        $stmt->bindValue(':category', $category);
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getVehicleByPlateNoAction()
    {
        $request = Request::createFromGlobals();
        $plate_no = $request->request->get('plateNo');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE plate_no = :plateNo;');
        $stmt->bindValue(':plateNo', $plate_no);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
