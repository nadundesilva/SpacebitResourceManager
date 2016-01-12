<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class EquipmentController extends Controller
{
    public function equipmentAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $equipment = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT DISTINCT department.faculty_name FROM department');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $facNames = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:equipment.html.twig', array(
            'equipment'=>$equipment,
            'facNames'=>$facNames,
        ));

    }

    public function getDepartmentsAction()
    {
        $request = Request::createFromGlobals();
        $faculty = $request->request->get('faculty'); //request : post

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT dept_name FROM department WHERE faculty_name=:faculty_name');
        $stmt->bindValue(':faculty_name', $faculty);
        $stmt->execute();
        $deptNames = $stmt->fetchAll();

        $response = new Response(json_encode(array('depts' => $deptNames)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getByCategoryAction()
    {
        $request = Request::createFromGlobals();
        $department = $request->request->get('department'); //request : post //in js what is posted obj.send("department=" + department);

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT DISTINCT equipment_type FROM equipment WHERE department_name = :department_name');
        $stmt->bindValue(':department_name', $department);
        $stmt->execute();
        $deptEquipments = $stmt->fetchAll();

        $response = new Response(json_encode(array('deptEquipment' => $deptEquipments)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getFromCategoryAction()
    {
        $request = Request::createFromGlobals();
        $equipCatagory = $request->request->get('equipCatagory'); //request : post //in js what is posted obj.send("department=" + department);

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment WHERE equipment_type = :equipCatagory');
        $stmt->bindValue(':equipCatagory', $equipCatagory);
        $stmt->execute();
        $deptEquipments = $stmt->fetchAll();

        $response = new Response(json_encode(array('catogaryEquipments' => $deptEquipments)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;

    }

    public function addRequestAction()
    {
        $request = Request::createFromGlobals();
        $date = $request->request->get('date');
        $time = $request->request->get('time');
        //$passenger_count = $request->request->get('passenger-count');
       // $vehicle_type = $request->request->get('vehicle-type');
       // $destination = $request->request->get('destination');

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('INSERT INTO vehicle_request(user_id, date, time, status, number_of_passengers, requested_type, requested_town) VALUES(:user_id, :date, :time, :status, :number_of_passengers, :requested_type, :requested_town);');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->bindValue(':date', $date);
        $stmt->bindValue(':time', $time);
        $stmt->bindValue(':status', 2);
       // $stmt->bindValue(':number_of_passengers', $passenger_count);
       // $stmt->bindValue(':requested_type', $vehicle_type);
       // $stmt->bindValue(':requested_town', $destination);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

}
