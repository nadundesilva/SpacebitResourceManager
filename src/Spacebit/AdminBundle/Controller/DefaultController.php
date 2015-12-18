<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction()
    {
        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN equipment USING(resource_id) WHERE status = 1 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->execute();
        $equipment_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN venue USING(resource_id) WHERE status = 1 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->execute();
        $venues_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM vehicle_request WHERE status = 1;');
        $stmt->execute();
        $vehicle_request_count = $stmt->fetch();

        return $this->render('SpacebitAdminBundle:Default:home.html.twig', array(
            'equipment_request_count'=>$equipment_request_count['count'],
            'venues_request_count'=>$venues_request_count['count'],
            'vehicles_request_count'=>$vehicle_request_count['count'],
        ));
    }

    public function equipmentAction()
    {
        return $this->render('SpacebitAdminBundle:Default:equipment.html.twig');
    }

    public function venuesAction()
    {
        return $this->render('SpacebitAdminBundle:Default:venues.html.twig');
    }

    public function vehiclesAction()
    {
        return $this->render('SpacebitAdminBundle:Default:vehicles.html.twig');
    }

    public function getVehicleByPlateNoAction()
    {
        $request = Request::createFromGlobals();
        $plate_no = $request->request->get('plate_no');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE plate_no LIKE :plateNo;');
        $stmt->bindValue(':plateNo', '%' . trim($plate_no) . '%');
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEquipmentAction()
    {
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $availability = $request->request->get('availability');
        $availability = $availability =='on'? true : false;
        $description = $request->request->get('description');
        $value1 = $request->request->get('value1');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('INSERT into resource values(:resource_id , :availability , :description);');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->bindValue(':availability', $availability);
        $stmt->bindValue(':description',$description );
        $stmt->execute();

        $stmt = $conn->prepare('INSERT into equipment values(:resource_id , :value1);');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->bindValue(':value1', $value1);

        $stmt->execute();

        return new Response('success');
    }

    public function addVehicleAction()
    {
        $request = Request::createFromGlobals();
        $plate_no= $request->request->get('plate_no');
        $type = $request->request->get('type');
        $model = $request->request->get('model');
        $capacity = $request->request->get('capacity');
        $driver_first_name = $request->request->get('driver_first_name');
        $driver_last_name= $request->request->get('driver_last_name');
        $availability = $request->request->get('availability');
        $availability = $availability =='on'? true : false;
        $value = $request->request->get('value');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('INSERT into vehicle values(:plate_no , :type, :model , :capacity ,:driver_first_name , :driver_last_name , :availability , :value);');
        $stmt->bindValue(':plate_no', $plate_no);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':model', $model);
        $stmt->bindValue(':capacity',$capacity);
        $stmt->bindValue(':driver_first_name',$driver_first_name);
        $stmt->bindValue(':driver_last_name',$driver_last_name);
        $stmt->bindValue(':availability',$availability);
        $stmt->bindValue(':value',$value);

        $stmt->execute();

        return new Response('success');
    }
}
