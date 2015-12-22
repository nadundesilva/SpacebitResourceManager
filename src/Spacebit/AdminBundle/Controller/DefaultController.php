<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction()
    {
        $request = Request::createFromGlobals();

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN equipment USING(resource_id) WHERE status = 2 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->execute();
        $equipment_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN venue USING(resource_id) WHERE status = 2 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $_SESSION['user_id']);
        $stmt->execute();
        $venues_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM vehicle_request WHERE status = 2;');
        $stmt->execute();
        $vehicle_request_count = $stmt->fetch();

        return $this->render('SpacebitAdminBundle:Default:home.html.twig', array(
            'equipment_request_count'=>$equipment_request_count['count'],
            'venues_request_count'=>$venues_request_count['count'],
            'vehicles_request_count'=>$vehicle_request_count['count'],
        ));
    }

    function getUserDetailsAction()
    {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT first_name, middle_name, last_name, email, telephone_no, access_level FROM user WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $user = $stmt->fetch();

        if($user['access_level'] == 0) {
            $stmt = $conn->prepare('SELECT nic, address, organizational_title, organizational_email, organizational_telephone FROM guest WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['nic'] = $result['nic'];
            $user['address'] = $result['address'];
            $user['organizational_title'] = $result['organizational_title'];
            $user['organizational_email'] = $result['organizational_email'];
            $user['organizational_telephone'] = $result['organizational_telephone'];
        } else if ($user['access_level'] == 1) {
            $stmt = $conn->prepare('SELECT dept_name, batch FROM student WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['batch'] = $result['batch'];
        } else {
            $stmt = $conn->prepare('SELECT dept_name, designation FROM staff WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['designation'] = $result['designation'];
        }

        $response = new Response(json_encode(array('result' => $user)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /*
     * Manage equipment section starts here
     */
    public function equipmentAction()
    {
        return $this->render('SpacebitAdminBundle:Default:equipment.html.twig');
    }


    /*
     * Manage equipment section starts here
     */

    public function equipmentsAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT request_id, user_id,resource_id, date_from,date_to, time_from,time_to, status FROM resource_request ORDER BY status DESC, date_from DESC, time_from DESC;');
        $stmt->execute();
        $equipment_requests = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:equipment.html.twig', array(
            'equipment_requests'=>$equipment_requests,
        ));
    }

    public function getAllEquipmentsAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT resource_id, availability, description, value, equipment_type FROM equipment LEFT OUTER JOIN resource  ;');
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getEquipmentByResourceIDAction()
    {
        $request = Request::createFromGlobals();
        $resource_id = $request->request->get('resource_id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment LEFT OUTER JOIN resource  WHERE resource_id = :resource_id;');
        $stmt->bindValue(':resouce-id', $resource_id);
        $stmt->execute();
        $result = $stmt->fetch();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function addEditEquipmentAction()
    {
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $equipment_type = $request->request->get('equipment_type');
        $description = $request->request->get('description');
        $availability = $request->request->get('availability');
        $value = $request->request->get('value');
        $update_type = $request->request->get('update-type');

        $conn = $this->get('database_connection');

        if($update_type == 'Add') {
            $stmt = $conn->prepare('INSERT into resource values(:resource_id, :availability, :description);');
            $stmt->bindValue(':plate_no', $resource_id);
            $stmt->bindValue(':availability', $availability);
            $stmt->bindValue(':description', $description);

            $response = 'success';
            if(!$stmt->execute()) {
                $response = $stmt->errorCode();
            } else {
                if ($update_type == 'Add') {
                    $stmt = $conn->prepare('INSERT INTO resource_administration VAlUES(:user_id, :resource_id)');
                    $stmt->bindValue(':user_id', $_SESSION['user_id']);
                    $stmt->bindValue(':resource_id', $resource_id);

                    if (!$stmt->execute()) {
                        $response = $stmt->errorCode();
                    }
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
        return new Response($response);
    }

    function handleEquipmentRequestAction()
    {
        $request = Request::createFromGlobals();
        $request_id = $request->request->get('request-id');
        $resource_id = $request->request->get('resource_id');


        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM equipment LEFT OUTER  JOIN  resource WHERE resource_id = :resource_id;');
        $stmt->bindValue(':resource_id', $resource_id);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return $response;
    }



    /*
     *
     * equipments finishes here
     *
     * */

    /*
     * Manage venues section starts here
     */
    public function venuesAction()
    {
        return $this->render('SpacebitAdminBundle:Default:venues.html.twig');
    }
    /*
     * Manage venues section ends here
     */

    /*
     * Manage vehicles section starts here
     */
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

    public function getAllVehiclesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT plate_no, type, model, capacity, driver_first_name, driver_last_name, value FROM vehicle ORDER BY type;');
        $stmt->execute();
        $result = $stmt->fetchAll();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getVehicleByPlateNoAction()
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

    public function addEditVehicleAction()
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

    function handleRequestAction()
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
    /*
     * Manage vehicles section ends here
     */
}
