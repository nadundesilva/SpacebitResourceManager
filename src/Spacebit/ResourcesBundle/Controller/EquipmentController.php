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

}
