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
        $category = $request->request->get('categor$request = Request::createFromGlobals();y');

        $conn = $this->get('database_connection');
        if($category == 'Other') {
            $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type != "Cars" AND type != "Vans" AND type != "Busses";');
        } else {
            $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type = :category;');
            $stmt->bindValue(':category', $category);
        }
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addRequestAction()
    {
        $request = Request::createFromGlobals();
        $date = $request->request->get('date');
        $time = $request->request->get('time');
        $passenger_count = $request->request->get('passenger-count');
        $vehicle_type = $request->request->get('vehicle-type');
        $destination = $request->request->get('destination');

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('INSERT INTO vehicle_request(user_id, date, time, status, number_of_passengers, requested_type, requested_town) VALUES(:user_id, :date, :time, :status, :number_of_passengers, :requested_type, :requested_town);');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->bindValue(':date', $date);
        $stmt->bindValue(':time', $time);
        $stmt->bindValue(':status', 2);
        $stmt->bindValue(':number_of_passengers', $passenger_count);
        $stmt->bindValue(':requested_type', $vehicle_type);
        $stmt->bindValue(':requested_town', $destination);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }
}
