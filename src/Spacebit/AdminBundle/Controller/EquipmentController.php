<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

class EquipmentController extends Controller
{
    public function equipmentAction()
    {
        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $conn = $this->get('database_connection');
        $conn->beginTransaction();
        $equipment_requests ='';
        $dept_names = '';

        try {
            $stmt = $conn->prepare("SELECT dept_name FROM staff  where user_id =:user_id;");
            $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
            $stmt->execute();
            $staff_member = $stmt->fetch();

            $stmt = $conn->prepare('SELECT request_id,type, user_id,resource_request.resource_id,date_from,date_to, time_from,time_to, status,type,department_name FROM resource_request  where (resource_request.resource_id is NULL  or resource_request.resource_id  in (select resource_id from equipment))  and resource_request.department_name = :dept_name ORDER BY status DESC, date_from DESC, time_from DESC;');
            $stmt->bindValue(':dept_name', $staff_member['dept_name']);
            $stmt->execute();
            $equipment_requests = $stmt->fetchAll();

            $stmt1 = $conn->prepare('SELECT dept_name from department ;');
            $stmt1->execute();
            $dept_names = $stmt1->fetchAll();

            $conn->commit();
        }catch (Exception $e){
            $conn->rollBack();

        }
        return $this->render('SpacebitAdminBundle:Default:equipment.html.twig', array(
            'equipment_requests'=>$equipment_requests,
            'dept_names'=>$dept_names,
        ));
    }


    public function getAllAction()
    {
        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
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

        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
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
    public function getByResourceTypeAction()
    {

        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
       $request = Request::createFromGlobals();
        $department_name = $request->request->get('department_name');
        $type = $request->request->get('type');


        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT resource_id FROM equipment INNER JOIN resource USING(resource_id) WHERE department_name = :department_name AND equipment_type= :type ;');
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':department_name', $department_name);

        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEditAction()
    {

        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $equipment_type = $request->request->get('equipment_type');
        $description = $request->request->get('description');
        $availability = $request->request->get('availability');

        $availability = ((string)$availability=='true')?1:0;

        $value = $request->request->get('value');
        $update_type = $request->request->get('update-type');
        $department_name = $request->request->get('department_name');


        $conn = $this->get('database_connection');
        $conn->beginTransaction();
        $response = 'success';
        try {


        if($update_type == 'Add') {
            $stmt = $conn->prepare('INSERT into resource values(:resource_id, :availability, :description);');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
                $conn->rollBack();
                $response = new Response($response);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            } else {

                    $stmt = $conn->prepare('INSERT INTO resource_administration VAlUES(:user_id, :resource_id)');
                    $stmt->bindValue(':user_id', $this->get('session')->get("user_id"));
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                        $conn->rollBack();
                        $response = new Response($response);
                        $response->headers->set('Content-Type', 'application/json');
                        return $response;

                    }

            }

            $stmt = $conn->prepare('INSERT into equipment values(:resource_id, :value, :equipment_type, :department_name);');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':value', $value);
            $stmt->bindValue(':equipment_type', $equipment_type);
            $stmt->bindValue(':department_name', $department_name);


            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
                $conn->rollBack();
                $response = new Response($response);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }
            $response = new Response($response);
            $response->headers->set('Content-Type', 'application/json');
            return ($response);
        } else {
            $stmt = $conn->prepare('UPDATE resource SET description = :description, availability = :availability WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
                $conn->rollBack();
                $response = new Response($response);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            } else {
                if ($update_type == 'Add') {
                    $stmt = $conn->prepare('UPDATE resource_administration  SET user_id = :user_id WHERE resource_id = :resource_id;');
                    $stmt->bindValue(':user_id', $this->get('session')->get("user_id"));
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                        $conn->rollBack();
                        $response = new Response($response);
                        $response->headers->set('Content-Type', 'application/json');
                        return $response;
                    }
                }
            }
            $stmt = $conn->prepare('UPDATE equipment SET value = :value, equipment_type = :equipment_type , department_name = :department_name WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':value', $value);
            $stmt->bindValue(':department_name', $department_name);

            $stmt->bindValue(':equipment_type', $equipment_type);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
                $conn->rollBack();
                $response = new Response($response);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }
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


    function changeRequestStatusAction()
    {
        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request_id');
        $status = $request->request->get('status');
        $resource_id= $request->request->get('resource_id');

        $conn = $this->get('database_connection');
        $conn->beginTransaction();

        $response = 'success';
        try {
            //check the date and time of the current request
            //check whether that equipment is already reserved in that time period
            //return the response
            if((string)$status=='1'){
            $stmt = $conn->prepare('SELECT request_id,date_from,date_to,time_from,time_to FROM resource_request  WHERE resource_id = :resource_id and status=1;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->execute();

            $stmt1 = $conn->prepare('SELECT date_from,date_to,time_from,time_to FROM resource_request  WHERE request_id = :request_id;');
            $stmt1->bindValue(':request_id', $request_id);
           $stmt1->execute();

            $result = $stmt1->fetch();
            $date_from = $result['date_from'];

            $date_to = $result['date_to'];
            $time_from = $result['time_from'];
            $time_to = $result['time_to'];

            while ($array = $stmt->fetch()) {
                //case 1 : date_from
                if(($date_to <$array['date_from'] ||$date_from >$array['date_to'])){
                    continue;
                }
                else if(($date_from <$array['date_from'] && $date_to == $array['date_from'])){
                    if($array['time_from']>=$time_to){
                        continue;
                    }
                }else if(($date_to > $array['date_to'] && $date_from >$array['date_from'])){
                    if($array['time_to']<=$time_from){
                        continue;
                    }
                }else{
                    $response = 'Booked';
                    $response = new Response($response);
                    return $response;
                }
            }
            }
            $stmt = $conn->prepare('UPDATE resource_request SET status = :status , resource_id = :resource_id WHERE request_id = :request_id;');
            if((string)$status=='2'){
                $stmt->bindValue(':resource_id', null);
            }else{
                $stmt->bindValue(':resource_id', $resource_id);
            }
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
