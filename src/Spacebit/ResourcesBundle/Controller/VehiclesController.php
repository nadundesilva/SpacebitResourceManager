<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VehiclesController extends Controller
{
    public function vehiclesAction()
    {
        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('SELECT DISTINCT type AS name FROM vehicle;');
        $stmt->execute();
        $vehicle_categories = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT * FROM vehicle_request WHERE date > CURDATE();');
        $stmt->execute();
        $vehicle_requests = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:vehicles.html.twig', array(
            'vehicles_categories'=>$vehicle_categories,
            'vehicle_requests'=>$vehicle_requests,
        ));
    }

    public function getByCategoryAction()
    {
        $request = Request::createFromGlobals();
        $category = $request->request->get('category');

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

    public function addEditRequestAction()
    {
        $request = Request::createFromGlobals();
        $date = $request->request->get('date');
        $time = $request->request->get('time');
        $passenger_count = $request->request->get('passenger-count');
        $vehicle_type = $request->request->get('vehicle-type');
        $destination = $request->request->get('destination');
        $update_type = $request->request->get('update-type');

        $conn = $this->get('database_connection');

        if ($update_type == 'Add') {
            $stmt = $conn->prepare('INSERT INTO vehicle_request(user_id, date, time, status, number_of_passengers, requested_type, requested_town) VALUES(:user_id, :date, :time, :status, :number_of_passengers, :requested_type, :requested_town);');
        } else {
            $request_id = $request->request->get('request-id');
            $stmt = $conn->prepare('UPDATE vehicle_request SET date = :date, time = :time, status = :status, number_of_passengers = :number_of_passengers, requested_type = :requested_type, requested_town = :requested_town WHERE user_id = :user_id and request_id = :request_id;');
            $stmt->bindValue(':request_id', $request_id);
        }
        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
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

    public function getPastRequestsAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT request_id, date, time, status, number_of_passengers, requested_type, requested_town, vehicle_plate_no FROM vehicle_request LEFT JOIN route ON route_group_id = group_id WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
