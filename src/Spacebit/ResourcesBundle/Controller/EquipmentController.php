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
        $faculty = $request->request->get('faculty'); //query : post

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
        $department = $request->request->get('department'); //query : post //in js what is posted obj.send("department=" + department);

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT DISTINCT equipment_type FROM equipment WHERE department_name = :department_name');
        $stmt->bindValue(':department_name', $department);
        $stmt->execute();
        $deptEquipments = $stmt->fetchAll();

        $response = new Response(json_encode(array('deptEquipment' => $deptEquipments)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getFromCategoryAction(){
        $request = Request::createFromGlobals();
        $equipCategory = $request->request->get('equipCategory'); //query : post //in js what is posted obj.send("department=" + department);

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment WHERE equipment_type = :equipCategory');
        $stmt->bindValue(':equipCategory', $equipCategory);
        $stmt->execute();
        $deptEquipments = $stmt->fetchAll();

        $response = new Response(json_encode(array('categoryEquipments' => $deptEquipments)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;

    }

    public function addRequestAction()
    {
        $request = Request::createFromGlobals();
        $dateFrom = $request->request->get('dateFrom');
        $dateTo = $request->request->get('dateTo');
        $timeFrom = $request->request->get('timeFrom');
        $timeTo = $request->request->get('timeTo');
        $type = $request->request->get('equipType');
        $department = $request->request->get('department');

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('INSERT INTO resource_request(user_id, date_from, date_to, time_from, time_to, status, type, department_name) VALUES(:user_id, :date_from, :date_to, :time_from, :time_to, :status, :type, :department);');

        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
        $stmt->bindValue(':date_from', $dateFrom);
        $stmt->bindValue(':date_to', $dateTo);
        $stmt->bindValue(':time_from', $timeFrom);
        $stmt->bindValue(':time_to', $timeTo);
        $stmt->bindValue(':status', 2);
        $stmt->bindValue(':type' ,$type );
        $stmt->bindValue(':department', $department);


        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

}
