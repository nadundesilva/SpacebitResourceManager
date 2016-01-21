<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VenuesController extends Controller
{
    public function venuesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM venue');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $allVenues = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT DISTINCT department.faculty_name FROM department');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $facNames = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT * FROM resource_request WHERE resource_request.type in (SELECT DISTINCT venue.venue_type from venue) and resource_request.date_from > CURDATE() and user_id = :user_id');
        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
        $stmt->execute();
        $future_requests = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:venues.html.twig', array(
            'venue'=>$allVenues,
            'facNames'=>$facNames,
            'future_requests' => $future_requests,
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
        $stmt = $conn->prepare('SELECT DISTINCT venue_type FROM venue WHERE dept_name = :department_name');
        $stmt->bindValue(':department_name', $department);
        $stmt->execute();
        $deptVenues = $stmt->fetchAll();

        $response = new Response(json_encode(array('deptVenues' => $deptVenues)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getFromCategoryAction()
    {
        if (!$this->get('login_authenticator')->authenticateStudentLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $request = Request::createFromGlobals();
        $venueCategory = $request->request->get('venueCategory'); //query : post //in js what is posted obj.send("department=" + department);
        $deptName = $request->request->get('department');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM venue WHERE venue_type = :venueCategory AND dept_name = :department');
        $stmt->bindValue(':venueCategory', $venueCategory);
        $stmt->bindValue(':department', $deptName);
        $stmt->execute();
        $deptEquipments = $stmt->fetchAll();

        $response = new Response(json_encode(array('categoryEquipments' => $deptEquipments)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;

    }

    public function addRequestAction()
    {
        if (!$this->get('login_authenticator')->authenticateStudentLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $request = Request::createFromGlobals();
        $resource_id = $request->request->get('resource_id');
        $dateFrom = $request->request->get('dateFrom');
        $dateTo = $request->request->get('dateTo');
        $timeFrom = $request->request->get('timeFrom');
        $timeTo = $request->request->get('timeTo');
        $requestType = $request->request->get('requestType');

        $conn = $this->get('database_connection');
        if ($requestType == 'Add') {
            $type = $request->request->get('venueType');
            $department = $request->request->get('department');
            $stmt = $conn->prepare('INSERT INTO resource_request(user_id,resource_id, date_from, date_to, time_from, time_to, status, type, department_name) VALUES(:user_id,:resource_id, :date_from, :date_to, :time_from, :time_to, :status, :type, :department);');
            $stmt->bindValue(':type' ,$type );
            $stmt->bindValue(':department', $department);
            $stmt->bindValue(':resource_id', $resource_id);
        }else {
            $request_id = $request->request->get('request-id');
            $stmt = $conn->prepare('UPDATE resource_request SET date_to = :date_to, date_from = :date_from, time_from = :time_from, time_to = :time_to, status = :status WHERE user_id = :user_id and request_id = :request_id;');
            $stmt->bindValue(':request_id', $request_id);
        }

        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));

        $stmt->bindValue(':date_from', $dateFrom);
        $stmt->bindValue(':date_to', $dateTo);
        $stmt->bindValue(':time_from', $timeFrom);
        $stmt->bindValue(':time_to', $timeTo);
        $stmt->bindValue(':status', 2);


        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

    public function getPastRequestsAction()
    {
        if (!$this->get('login_authenticator')->authenticateStudentLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM resource_request INNER JOIN venue USING (resource_id) WHERE resource_request.type in (SELECT DISTINCT venue.venue_type from venue) AND user_id = :user_id;');
        $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
        $stmt->execute();
        $allRequests = $stmt->fetchAll();

        $response = new Response(json_encode(array('allRequests' => $allRequests)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }



}
