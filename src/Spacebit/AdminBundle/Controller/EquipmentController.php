<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class EquipmentController extends Controller
{
    public function equipmentAction()
    {
    /*
        $this->get('session')->set('user_id', 'AB1234');
        $this->get('session')->set('first_name', 'John');
        $this->get('session')->set('last_name', 'Doe');
        $this->get('session')->set('access_level', 5);
    */
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT request_id, user_id,equipment.resource_id, date_from,date_to, time_from,time_to, status FROM resource_request INNER JOIN equipment on  equipment.resource_id = resource_request.resource_id ORDER BY status DESC, date_from DESC, time_from DESC;');
        $stmt->execute();
        $equipment_requests = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:equipment.html.twig', array(
            'equipment_requests'=>$equipment_requests,
        ));
    }

    public function getAllAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT resource_id,  description, value, equipment_type FROM equipment INNER JOIN resource USING(resource_id);');
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getByResourceIDAction()
    {
        $request = Request::createFromGlobals();
        $resource_id = $request->request->get('resource_id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment INNER JOIN resource USING(resource_id) WHERE resource_id = :resource_id;');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEditAction()
    {
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $equipment_type = $request->request->get('equipment_type');
        $description = $request->request->get('description');
        $availability = $request->request->get('availability');
        $value = $request->request->get('value');
        $update_type = $request->request->get('update_type');

        $conn = $this->get('database_connection');

        if($update_type == 'Add') {
            $stmt = $conn->prepare('INSERT into resource values(:resource_id, :availability, :description);');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
            } else {

                    $stmt = $conn->prepare('INSERT INTO resource_administration VAlUES(:user_id, :resource_id)');
                    $stmt->bindValue(':user_id', $this->get('session')->get("user_id"));
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                    }

            }

            $stmt = $conn->prepare('INSERT into equipment values(:resource_id, :value, :equipment_type);');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':value', $value);
            $stmt->bindValue(':equipment_type', $equipment_type);

            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
            }
        } else {
            $stmt = $conn->prepare('UPDATE resource SET description = :description, availability = :availability WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resoucre_id', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
            } else {
                if ($update_type == 'Add') {
                    $stmt = $conn->prepare('UPDATE resource_administration  SET user_id = :user_id WHERE resource_id = :resource_id;');
                    $stmt->bindValue(':user_id', $_SESSION['user_id']);
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                    }
                }
            }
            $stmt = $conn->prepare('UPDATE equipment SET value = :value, equipment_type = :equipment_type WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':value', $value);
            $stmt->bindValue(':equipment_type', $equipment_type);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
            }

        }
        $response->headers->set('Content-Type', 'application/json');
        return new Response($response);
    }


    function changeRequestStatusAction()
    {
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request-id');
        $status = $request->request->get('status');

        $conn = $this->get('database_connection');
        $conn->beginTransaction();

        $response = 'success';
        try {


            $stmt = $conn->prepare('UPDATE resource_request SET status = :status,WHERE request_id = :request_id;');
            $stmt->bindValue(':status', $status);
            $stmt->bindValue(':request_id', $request_id);
            if (!$stmt->execute()) {
                throw new \Symfony\Component\Config\Definition\Exception\Exception();
            }

            $conn->commit();
        } catch (Exception $e) {
            $conn->rollBack();
            $response = $e->getCode();
        }

        $response = new Response($response);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

}
