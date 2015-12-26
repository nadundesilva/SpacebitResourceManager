<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VehiclesController extends Controller
{
    public function vehiclesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT request_id, user_id, date, time, number_of_passengers, requested_type, requested_town, status FROM vehicle_request ORDER BY status DESC, date DESC, time DESC;');
        $stmt->execute();
        $vehicle_requests = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:vehicles.html.twig', array(
            'vehicle_requests'=>$vehicle_requests,
        ));
    }

    public function getAllAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT plate_no, type, model, capacity, driver_first_name, driver_last_name, value FROM vehicle ORDER BY type;');
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getByPlateNoAction()
    {
        $request = Request::createFromGlobals();
        $plate_no = $request->request->get('plate-no');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE plate_no = :plateNo;');
        $stmt->bindValue(':plateNo', $plate_no);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEditAction()
    {
        $request = Request::createFromGlobals();
        $plate_no= $request->request->get('plate-no');
        $type = $request->request->get('type');
        $model = $request->request->get('model');
        $capacity = $request->request->get('capacity');
        $driver_first_name = $request->request->get('driver-first-name');
        $driver_last_name= $request->request->get('driver-last-name');
        $availability = ($request->request->get('availability') == 'on');
        $value = $request->request->get('value');
        $update_type = $request->request->get('update-type');

        $conn = $this->get('database_connection');

        if($update_type == 'Add') {
            $stmt = $conn->prepare('INSERT into vehicle values(:plate_no, :type, :model, :capacity,:driver_first_name, :driver_last_name, :availability, :value);');
        } else {
            $stmt = $conn->prepare('UPDATE vehicle SET type = :type, model = :model, capacity = :capacity,driver_first_name = :driver_first_name, driver_last_name = :driver_last_name, availability = :availability , value = :value WHERE plate_no = :plate_no;');
        }
        $stmt->bindValue(':plate_no', $plate_no);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':model', $model);
        $stmt->bindValue(':capacity',$capacity);
        $stmt->bindValue(':driver_first_name',$driver_first_name);
        $stmt->bindValue(':driver_last_name',$driver_last_name);
        $stmt->bindValue(':availability',$availability);
        $stmt->bindValue(':value',$value);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        } else {
            if ($update_type == 'Add') {
                $stmt = $conn->prepare('INSERT INTO vehicle_administration VAlUES(:user_id, :plate_no)');
                $stmt->bindValue(':user_id', $_SESSION['user_id']);
                $stmt->bindValue(':plate_no', $plate_no);

                if (!$stmt->execute()) {
                    $response = $stmt->errorCode();
                }
            }
        }

        return new Response($response);
    }

    function getRequestByIDAction()
    {
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request-id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle_request WHERE request_id = :request_id;');
        $stmt->bindValue(':request_id', $request_id);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    function changeRequestStatusAction()
    {
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request-id');
        $plate_no = $request->request->get('plate-no');


        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE plate_no = :plateNo;');
        $stmt->bindValue(':plateNo', $plate_no);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return $response;
    }
}
