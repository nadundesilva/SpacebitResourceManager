<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VenuesController extends Controller
{
    public function venuesAction()
    {

        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('CREATE OR REPLACE VIEW view1  as select venue.resource_id from venue INNER JOIN resource_administration on venue.resource_id = resource_administration.resource_id and resource_administration.user_id = "AB1234";');
        $stmt->execute();

        $stmt = $conn->prepare('SELECT request_id, user_id,view1.resource_id, date_from,date_to, time_from,time_to, status FROM  resource_request INNER JOIN view1  using(resource_id) ORDER BY status DESC, date_from DESC, time_from DESC ;');

        $stmt->execute();
        $venues_requests = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:venues.html.twig', array(
            'venues_requests'=>$venues_requests,
        ));
    }

    public function getAllAction()
    {

        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT resource_id, availability, description, capacity, closing_time, dept_name, name, opening_time, venue_type FROM venue INNER JOIN resource USING(resource_id);');
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
        $stmt = $conn->prepare('SELECT * FROM venue INNER JOIN resource USING(resource_id) WHERE resource_id = :resource_id;');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEditAction()
    {


        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $capacity = $request->request->get('capacity');
        $description = $request->request->get('description');
        $availability = $request->request->get('availability');
        $availability = ((string)$availability == 'true' ? 1 : 0);
        $closing_time = $request->request->get('closing_time');
        $dept_name = $request->request->get('dept_name');
        $name = $request->request->get('name');
        $opening_time = $request->request->get('opening_time');
        $venue_type = $request->request->get('venue_type');
        $update_type = $request->request->get('update-type');
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
                if ($update_type == 'Add') {
                    $stmt = $conn->prepare('INSERT INTO resource_administration VAlUES(:user_id, :resource_id)');
                    $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                    }
                }
            }

            $stmt = $conn->prepare('INSERT into venue values(:resource_id,:name,:opening_time,:closing_time,:capacity, :dept_name,:venue_type);');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':capacity', $capacity);
            $stmt->bindValue(':closing_time', $closing_time);
            $stmt->bindValue(':dept_name', $dept_name);
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':opening_time', $opening_time);
            $stmt->bindValue(':venue_type', $venue_type);

            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
            }
        } else {
            $stmt = $conn->prepare('UPDATE resource SET description = :description, availability = :availability WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
            } else {
                if ($update_type == 'Add') {
                    $stmt = $conn->prepare('UPDATE resource_administration  SET user_id = :user_id WHERE resource_id = :resource_id;');
                    $stmt->bindValue(':user_id', $this->get('session')->get('user_id'));
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                    }
                }
            }
            $stmt = $conn->prepare('UPDATE venue SET capacity = :capacity, closing_time = :closing_time , dept_name = :dept_name , name = :name , opening_time = :opening_time , venue_type = :venue_type WHERE resource_id = :resource_id;');
            $stmt->bindValue(':resource_id', $resource_id);
            $stmt->bindValue(':capacity', $capacity);
            $stmt->bindValue(':closing_time', $closing_time);
            $stmt->bindValue(':dept_name', $dept_name);
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':opening_time', $opening_time);
            $stmt->bindValue(':venue_type', $venue_type);

            $response = 'success';
            if (!$stmt->execute()) {
                $response = $stmt->errorCode();
            }

        }
        return new Response($response);
    }


    function changeRequestStatusAction()
    {


        if (!$this->get('login_authenticator')->authenticateLowLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request_id');
        $status = $request->request->get('status');

        $conn = $this->get('database_connection');
        $conn->beginTransaction();

        $response = 'success';
        try {

            if((string)$status =='1') {


                $stmt1 = $conn->prepare('SELECT resource_id,date_from,date_to,time_from,time_to FROM resource_request  WHERE request_id = :request_id;');
                $stmt1->bindValue(':request_id', $request_id);
                $stmt1->execute();

                $result = $stmt1->fetch();
                $date_from = $result['date_from'];
                $resource_id = $result['resource_id'];
                $date_to = $result['date_to'];
                $time_from = $result['time_from'];
                $time_to = $result['time_to'];
                $stmt = $conn->prepare('SELECT date_from,date_to,time_from,time_to FROM resource_request  WHERE resource_id = :resource_id and status = 1 ;');
                $stmt->bindValue(':resource_id', $resource_id);
                $stmt->execute();

                while ($array = $stmt->fetch()) {
                    //case 1 : date_from
                    if (($date_to < $array['date_from'] || $date_from > $array['date_to'])) {
                        continue;
                    } else if (($date_from < $array['date_from'] && $date_to == $array['date_from'])) {
                        if ($array['time_from'] >= $time_to) {
                            continue;
                        }
                    } else if (($date_to > $array['date_to'] && $date_from > $array['date_from'])) {
                        if ($array['time_to'] <= $time_from) {
                            continue;
                        }
                    } else {
                        $response = 'Booked';
                        $response = new Response($response);
                        return $response;
                    }
                }
            }
            $stmt = $conn->prepare('UPDATE resource_request SET status = :status WHERE request_id = :request_id;');
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
